import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFundProjectionScreen,
  AiFillStar,
} from "react-icons/ai";
import { CgFileDocument, CgGitFork } from "react-icons/cg";
import { ImBlog } from "react-icons/im";
import { FaBars, FaTimes } from "react-icons/fa";

function NavBar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 767);
    if (window.innerWidth > 767) setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Ana Sayfa", icon: <AiOutlineHome size={18} /> },
    { path: "/about", label: "Hakkımda", icon: <AiOutlineUser size={18} /> },
    { path: "/project", label: "Projeler", icon: <AiOutlineFundProjectionScreen size={18} /> },
    { path: "/resume", label: "Özgeçmiş", icon: <CgFileDocument size={18} /> },
    { path: "/blog", label: "Blog", icon: <ImBlog size={16} /> },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navbarStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 9999,
    padding: isScrolled ? "0.6rem 0" : "1rem 0",
    background: isScrolled
      ? "rgba(12, 10, 26, 0.78)"
      : "rgba(12, 10, 26, 0.95)",
    backdropFilter: isScrolled ? "blur(24px) saturate(180%)" : "blur(8px)",
    WebkitBackdropFilter: isScrolled ? "blur(24px) saturate(180%)" : "blur(8px)",
    borderBottom: isScrolled
      ? "1px solid rgba(255, 255, 255, 0.06)"
      : "1px solid rgba(255, 255, 255, 0.02)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.3)" : "none",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link to="/" onClick={() => setIsMenuOpen(false)}
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span style={{
              fontSize: "1.3rem", fontWeight: 700,
              background: "linear-gradient(135deg, #8b3fd9 0%, #f472b6 50%, #60a5fa 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}>
              Ümitcan Çinar
            </span>
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          style={{
            display: isMobile ? "none" : "flex",
            listStyle: "none", margin: 0, padding: 0,
            alignItems: "center", gap: "0.25rem",
          }}
        >
          {navLinks.map((link, index) => (
            <motion.li
              key={link.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              style={{ position: "relative" }}
            >
              <Link to={link.path}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.6rem 1rem",
                  color: isActive(link.path) ? "#f1f5f9" : "#94a3b8",
                  textDecoration: "none", fontSize: "0.9rem",
                  fontWeight: isActive(link.path) ? 600 : 400,
                  borderRadius: "8px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.target.style.color = "#f1f5f9";
                    e.target.style.background = "rgba(255, 255, 255, 0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.target.style.color = "#94a3b8";
                    e.target.style.background = "transparent";
                  }
                }}
              >
                {link.icon}
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    style={{
                      position: "absolute", bottom: "2px",
                      left: "50%", transform: "translateX(-50%)",
                      width: "60%", height: "3px",
                      borderRadius: "3px",
                      background: "linear-gradient(90deg, #8b3fd9, #f472b6)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </motion.li>
          ))}

          <motion.li
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <a href="https://github.com/umitcancinar/Portfolio-Umitcan"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0.5rem 1rem", color: "#94a3b8",
                textDecoration: "none", fontSize: "0.9rem",
                borderRadius: "8px",
                border: "1px solid rgba(139, 63, 217, 0.3)",
                background: "rgba(139, 63, 217, 0.1)",
                transition: "all 0.3s ease", cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(139, 63, 217, 0.25)";
                e.target.style.borderColor = "rgba(139, 63, 217, 0.5)";
                e.target.style.color = "#f1f5f9";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(139, 63, 217, 0.1)";
                e.target.style.borderColor = "rgba(139, 63, 217, 0.3)";
                e.target.style.color = "#94a3b8";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <CgGitFork size={16} />
              <AiFillStar size={14} />
            </a>
          </motion.li>
        </motion.ul>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Kapat" : "Menüyü Aç"}
          style={{
            display: isMobile ? "flex" : "none",
            alignItems: "center", justifyContent: "center",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            width: "44px", height: "44px",
            cursor: "pointer", color: "#f1f5f9",
            fontSize: "1.2rem",
            transition: "all 0.3s ease",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              overflow: "hidden",
              background: "rgba(12, 10, 26, 0.95)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <ul style={{
              listStyle: "none", margin: 0,
              padding: "0.5rem 2rem 1rem",
              display: "flex", flexDirection: "column", gap: "0.25rem",
            }}>
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link to={link.path} onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      color: isActive(link.path) ? "#f1f5f9" : "#94a3b8",
                      textDecoration: "none", fontSize: "1rem",
                      fontWeight: isActive(link.path) ? 600 : 400,
                      borderRadius: "10px",
                      background: isActive(link.path)
                        ? "rgba(139, 63, 217, 0.15)"
                        : "transparent",
                      border: isActive(link.path)
                        ? "1px solid rgba(139, 63, 217, 0.2)"
                        : "1px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {link.icon}
                    {link.label}
                    {isActive(link.path) && (
                      <span style={{
                        marginLeft: "auto", width: "6px", height: "6px",
                        borderRadius: "50%", background: "#8b3fd9",
                      }} />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default NavBar;
