import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import Particle from "../Particle";
import { fetchBlogPosts } from "../../services/api";
import {
  BsSearch,
  BsX,
  BsClock,
  BsCalendar3,
  BsNewspaper,
  BsTags,
  BsFolder2,
  BsArrowRight,
} from "react-icons/bs";

function BlogSkeleton() {
  return (
    <div className="blog-skeleton-card">
      <div className="skeleton-img" style={{ height: "200px" }} />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-title" style={{ width: "70%" }} />
        <div className="skeleton-line skeleton-text" />
        <div className="skeleton-line skeleton-text short" />
        <div className="skeleton-techs">
          <div className="skeleton-tech" />
          <div className="skeleton-tech" />
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: "all", label: "T\u00fcm\u00fc", icon: <BsNewspaper /> },
  { id: "genel", label: "Genel", icon: <BsFolder2 /> },
  { id: "teknoloji", label: "Teknoloji" },
  { id: "yazilim", label: "Yaz\u0131l\u0131m" },
  { id: "egitim", label: "E\u011fitim" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return dateStr; }
}

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "all");

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          tag: selectedTag !== "all" ? selectedTag : undefined,
        };
        const data = await fetchBlogPosts(params);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [selectedCategory, selectedTag]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedTag !== "all";

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
            <strong className="purple">Blog</strong> &amp; Teknoloji
          </h1>
          <p className="projects-subtitle">
            Yaz\u0131l\u0131m, teknoloji ve e\u011fitim \u00fczerine yaz\u0131lar
          </p>
        </motion.div>

        <motion.div className="projects-filters"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="projects-search-wrap">
            <BsSearch className="projects-search-icon" size={16} />
            <input type="text" className="projects-search-input"
              placeholder="Blog yaz\u0131s\u0131 ara..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchParams({ search: e.target.value }); }}
            />
            {searchQuery && (
              <button className="projects-search-clear" onClick={() => setSearchQuery("")}>
                <BsX size={18} />
              </button>
            )}
          </div>

          <div className="projects-categories">
            {CATEGORIES.map((cat) => (
              <button key={cat.id}
                className={`projects-cat-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon && <span className="cat-icon">{cat.icon}</span>}
                {cat.label}
              </button>
            ))}
          </div>

          {allTags.length > 0 && (
            <div className="blog-tags-filter">
              <BsTags size={14} className="blog-tags-icon" />
              <button className={`blog-tag-btn ${selectedTag === "all" ? "active" : ""}`}
                onClick={() => setSelectedTag("all")}>T\u00fcm\u00fc</button>
              {allTags.map((tag) => (
                <button key={tag}
                  className={`blog-tag-btn ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => setSelectedTag(tag)}>#{tag}</button>
              ))}
            </div>
          )}

          {hasActiveFilters && (
            <div className="projects-active-filters">
              <span className="projects-filter-count">{filteredPosts.length} sonu\u00e7</span>
              <button className="projects-clear-filters" onClick={handleClearFilters}>
                <BsX size={16} /> Temizle
              </button>
            </div>
          )}
        </motion.div>

        {loading ? (
          <motion.div className="blog-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => <BlogSkeleton key={n} />)}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredPosts.length > 0 ? (
              <motion.div className="blog-grid" key="posts"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {filteredPosts.map((post, index) => (
                  <motion.div key={post.id || post.slug || index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -6 }}
                    style={{ height: "100%" }}
                  >
                    <Link to={`/blog/${post.slug}`} className="blog-card-link">
                      <div className="blog-card-enhanced">
                        {post.coverImage ? (
                          <div className="blog-card-img-wrap">
                            <img src={post.coverImage} alt={post.title} className="blog-card-img"
                              loading="lazy"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          </div>
                        ) : (
                          <div className="blog-card-img-placeholder">
                            <BsNewspaper size={48} />
                          </div>
                        )}
                        <div className="blog-card-body-enhanced">
                          <div className="blog-card-meta">
                            <span className="blog-card-date">
                              <BsCalendar3 size={12} /> {formatDate(post.createdAt || post.publishedAt || post.date)}
                            </span>
                            {post.readTime && (
                              <span className="blog-card-readtime">
                                <BsClock size={12} /> {post.readTime} dk
                              </span>
                            )}
                          </div>
                          <h3 className="blog-card-title">{post.title}</h3>
                          <p className="blog-card-excerpt">{post.excerpt?.substring(0, 120)}...</p>
                          <div className="blog-card-footer">
                            {post.tags && post.tags.length > 0 && (
                              <div className="blog-card-tags">
                                {post.tags.slice(0, 3).map((tag, i) => (
                                  <Badge key={i} bg="purple" className="blog-card-tag">#{tag}</Badge>
                                ))}
                              </div>
                            )}
                            <span className="blog-card-readmore">Oku <BsArrowRight size={14} /></span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div className="projects-empty" key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="projects-empty-icon"><BsNewspaper size={48} /></div>
                <h3>Yaz\u0131 Bulunamad\u0131</h3>
                <p>Araman\u0131za uygun blog yaz\u0131s\u0131 bulunamad\u0131.</p>
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

export default Blog;
