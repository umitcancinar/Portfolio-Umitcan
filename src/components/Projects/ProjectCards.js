import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CgWebsite } from "react-icons/cg";
import { BsGithub, BsStarFill, BsStar } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";

import { getRawGithubUrl } from "../../utils/imageHelper";

/**
 * Fetches GitHub star count from the repo URL.
 */
function useGithubStars(githubUrl) {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    if (!githubUrl) return;
    try {
      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const owner = match[1];
        const repo = match[2].replace(/\.git$/, "");
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.stargazers_count !== undefined) {
              setStars(data.stargazers_count);
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, [githubUrl]);

  return stars;
}

function ProjectCards({ imgPath, title, description, ghLink, demoLink, technologies, isBlog, index }) {
  const githubStars = useGithubStars(ghLink);

  const techColors = {
    React: "#61dafb",
    "Node.js": "#339933",
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    PostgreSQL: "#336791",
    Prisma: "#2d3748",
    Python: "#3776ab",
    Docker: "#2496ed",
    AWS: "#ff9900",
    Firebase: "#ffca28",
    MongoDB: "#47a248",
    Express: "#000000",
    CSS: "#1572b6",
    HTML: "#e34f26",
    Git: "#f05032",
    Bootstrap: "#7952b3",
    Tailwind: "#06b6d4",
    Vue: "#4fc08d",
    Angular: "#dd0031",
    Laravel: "#ff2d20",
    PHP: "#777bb4",
    Java: "#007396",
    Flutter: "#02569b",
    Kotlin: "#7f52ff",
    Swift: "#f05138",
    "C#": "#239120",
    Go: "#00add8",
    Rust: "#000000",
    Next: "#000000",
    "Next.js": "#000000",
    GraphQL: "#e10098",
    Redis: "#dc382d",
    MySQL: "#4479a1",
    SQLite: "#003b57",
  };

  const getTechColor = (tech) => {
    return techColors[tech] || "#8b3fd9";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: (index || 0) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      style={{ height: "100%" }}
    >
      <div
        className="project-card-enhanced"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image Container with Overlay */}
        <div className="project-card-image-wrap">
          <img
            src={getRawGithubUrl(imgPath)}
            alt={title}
            className="project-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/600x400/1a1a2e/8b3fd9?text=Project";
            }}
          />
          <div className="project-card-overlay">
            <div className="project-card-overlay-links">
              {ghLink && (
                <a
                  href={ghLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-overlay-btn"
                  title="GitHub"
                >
                  <BsGithub size={20} />
                </a>
              )}
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-overlay-btn"
                  title="Live Demo"
                >
                  <FiExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="project-card-body-enhanced">
          <h3 className="project-card-title">{title}</h3>
          <p className="project-card-description">{description}</p>

          {/* Technologies */}
          {technologies && technologies.length > 0 && (
            <div className="project-card-techs">
              {technologies.map((tech, i) => (
                <span
                  key={i}
                  className="project-tech-badge"
                  style={{
                    background: `${getTechColor(tech)}20`,
                    borderColor: `${getTechColor(tech)}40`,
                    color: getTechColor(tech),
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Row: GitHub Stars + Buttons */}
          <div className="project-card-bottom">
            {ghLink && (
              <div className="project-card-stars">
                <BsStarFill size={14} color="#fbbf24" />
                <span>{githubStars !== null ? githubStars : "..."}</span>
              </div>
            )}
            <div className="project-card-actions">
              {ghLink && (
                <a
                  href={ghLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-action-btn"
                >
                  <BsGithub size={16} />
                  <span>Repo</span>
                </a>
              )}
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-action-btn project-action-btn-primary"
                >
                  <CgWebsite size={16} />
                  <span>Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default ProjectCards;
