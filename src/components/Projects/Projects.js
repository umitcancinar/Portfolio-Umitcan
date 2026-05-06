import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { fetchProjects as apiFetchProjects } from "../../services/api";
import {
  BsSearch,
  BsFilter,
  BsGrid3X3Gap,
  BsX,
  BsFolder2,
  BsCodeSlash,
} from "react-icons/bs";

// ─── Skeleton ───
function ProjectSkeleton() {
  return (
    <div className="project-skeleton">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-text" />
        <div className="skeleton-line skeleton-text short" />
        <div className="skeleton-techs">
          <div className="skeleton-tech" />
          <div className="skeleton-tech" />
          <div className="skeleton-tech" />
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: "all", label: "T\u00fcm\u00fc", icon: <BsGrid3X3Gap /> },
  { id: "web", label: "Web", icon: <BsFolder2 /> },
  { id: "mobile", label: "Mobile" },
  { id: "backend", label: "Backend" },
  { id: "fullstack", label: "Full Stack" },
  { id: "api", label: "API" },
  { id: "other", label: "Di\u011fer" },
];

function extractTechnologies(projects) {
  const techSet = new Set();
  projects.forEach((p) => {
    if (p.technologies && Array.isArray(p.technologies)) {
      p.technologies.forEach((t) => techSet.add(t));
    }
  });
  return Array.from(techSet).sort();
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTech, setSelectedTech] = useState("all");
  const [showTechFilter, setShowTechFilter] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const response = await apiFetchProjects();
        const data = response?.projects || response || [];
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const technologies = useMemo(() => extractTechnologies(projects), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const titleMatch = project.title?.toLowerCase().includes(q);
        const descMatch = project.description?.toLowerCase().includes(q);
        const techMatch =
          project.technologies?.some((t) => t.toLowerCase().includes(q)) || false;
        if (!titleMatch && !descMatch && !techMatch) return false;
      }
      if (selectedCategory !== "all") {
        const title = project.title?.toLowerCase() || "";
        const desc = project.description?.toLowerCase() || "";
        const techs = (project.technologies || []).map((t) => t.toLowerCase());
        const combined = [title, desc, ...techs].join(" ");
        const categoryMap = {
          web: ["react", "vue", "angular", "css", "html", "frontend", "web"],
          mobile: ["mobile", "flutter", "react native", "android", "ios"],
          backend: ["node", "express", "server", "backend", "database"],
          fullstack: ["fullstack", "full stack", "mern", "next"],
          api: ["api", "rest", "graphql", "endpoint"],
        };
        const keywords = categoryMap[selectedCategory];
        if (keywords && !keywords.some((k) => combined.includes(k))) return false;
      }
      if (selectedTech !== "all" && project.technologies) {
        if (!project.technologies.includes(selectedTech)) return false;
      }
      return true;
    });
  }, [projects, searchQuery, selectedCategory, selectedTech]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTech("all");
  }, []);

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedTech !== "all";

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="project-heading">
            Son <strong className="purple">\u00c7al\u0131\u015fmalar\u0131m</strong>
          </h1>
          <p className="projects-subtitle">
            \u0130\u015fte \u00fczerinde \u00e7al\u0131\u015ft\u0131\u011f\u0131m baz\u0131 \u00f6nemli projeler.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="projects-filters"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="projects-search-wrap">
            <BsSearch className="projects-search-icon" size={16} />
            <input
              type="text"
              className="projects-search-input"
              placeholder="Proje ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="projects-search-clear" onClick={() => setSearchQuery("")}>
                <BsX size={18} />
              </button>
            )}
          </div>

          <div className="projects-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`projects-cat-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon && <span className="cat-icon">{cat.icon}</span>}
                {cat.label}
              </button>
            ))}
          </div>

          <div className="projects-tech-filter-wrap">
            <button
              className="projects-tech-toggle"
              onClick={() => setShowTechFilter(!showTechFilter)}
            >
              <BsCodeSlash size={14} />
              <span>Teknoloji</span>
              <BsFilter size={16} />
            </button>
            {showTechFilter && (
              <motion.div
                className="projects-tech-dropdown"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
              >
                <button
                  className={`projects-tech-option ${selectedTech === "all" ? "active" : ""}`}
                  onClick={() => setSelectedTech("all")}
                >
                  T\u00fcm\u00fc
                </button>
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    className={`projects-tech-option ${selectedTech === tech ? "active" : ""}`}
                    onClick={() => setSelectedTech(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {hasActiveFilters && (
            <div className="projects-active-filters">
              <span className="projects-filter-count">
                {filteredProjects.length} sonu\u00e7 bulundu
              </span>
              <button className="projects-clear-filters" onClick={handleClearFilters}>
                <BsX size={16} /> Filtreleri Temizle
              </button>
            </div>
          )}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <motion.div className="projects-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <ProjectSkeleton key={n} />
            ))}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                className="projects-grid"
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id || index}
                    index={index}
                    imgPath={project.imgPath || project.imageUrl}
                    title={project.title}
                    description={project.description}
                    ghLink={project.ghLink || project.githubUrl}
                    demoLink={project.demoLink || project.liveUrl}
                    technologies={project.technologies}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="projects-empty"
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="projects-empty-icon"><BsFolder2 size={48} /></div>
                <h3>Sonu\u00e7 Bulunamad\u0131</h3>
                <p>Arama kriterlerinize uygun proje bulunamad\u0131.</p>
                <button className="projects-empty-btn" onClick={handleClearFilters}>
                  Filtreleri Temizle
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
