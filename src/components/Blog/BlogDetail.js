import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBlogPostBySlug } from "../../services/api";
import Particle from "../Particle";
import { BsArrowLeft, BsClock, BsCalendar3, BsPerson } from "react-icons/bs";

function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const data = await fetchBlogPostBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadPost();
  }, [slug]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <Container fluid className="project-section">
        <Particle />
        <Container>
          <div className="blog-detail-skeleton">
            <div className="skeleton-line skeleton-title" style={{ width: "60%", height: "40px" }} />
            <div className="skeleton-line skeleton-text" />
            <div className="skeleton-line skeleton-text" />
            <div className="skeleton-line skeleton-text short" />
          </div>
        </Container>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container fluid className="project-section">
        <Particle />
        <Container className="text-center">
          <h2 className="project-heading">Blog yazısı bulunamadı</h2>
          <Link to="/blog" className="btn btn-primary mt-4">
            Blog'a Dön
          </Link>
        </Container>
      </Container>
    );
  }

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => navigate("/blog")}
            className="blog-back-btn"
          >
            <BsArrowLeft size={20} />
            Blog'a Dön
          </button>

          <article className="blog-detail-article">
            {post.coverImage && (
              <div className="blog-detail-cover-wrap">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="blog-detail-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <h1 className="blog-detail-title">{post.title}</h1>

            <div className="blog-detail-meta">
              <span className="blog-detail-meta-item">
                <BsCalendar3 size={14} />
                {formatDate(post.createdAt || post.publishedAt || post.date)}
              </span>
              {post.readTime && (
                <span className="blog-detail-meta-item">
                  <BsClock size={14} />
                  {post.readTime} dk okuma
                </span>
              )}
              {post.author?.username && (
                <span className="blog-detail-meta-item">
                  <BsPerson size={14} />
                  {post.author.username}
                </span>
              )}
            </div>

            {post.category && (
              <div className="blog-detail-category">
                <Badge bg="purple" className="blog-detail-cat-badge">
                  {post.category}
                </Badge>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="blog-detail-tags">
                {post.tags.map((tag, i) => (
                  <Link
                    key={i}
                    to={`/blog?tag=${tag}`}
                    className="blog-detail-tag"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div
              className="blog-detail-content"
              dangerouslySetInnerHTML={{
                __html: post.content
                  ? post.content
                      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.+?)\*/g, "<em>$1</em>")
                      .replace(/- (.+)$/gm, "<li>$1</li>")
                      .replace(/\n\n/g, "</p><p>")
                      .replace(/\n/g, "<br/>")
                  : post.excerpt || "",
              }}
            />
          </article>
        </motion.div>
      </Container>
    </Container>
  );
}

export default BlogDetail;