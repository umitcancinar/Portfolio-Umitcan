import React from "react";
import { motion } from "framer-motion";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com/umitcancinar", icon: <AiFillGithub size={22} />, label: "GitHub" },
    { href: "https://www.linkedin.com/in/umitcancinar/", icon: <AiFillLinkedin size={22} />, label: "LinkedIn" },
    { href: "https://twitter.com/umitcancinar", icon: <AiFillTwitterCircle size={22} />, label: "Twitter" },
    { href: "https://instagram.com/umitcancinar", icon: <AiFillInstagram size={22} />, label: "Instagram" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        background: "linear-gradient(180deg, transparent, rgba(12, 10, 26, 0.8))",
        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
        padding: "2rem 0 1.5rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#64748b",
                letterSpacing: "0.02em",
              }}
            >
              &copy; {currentYear}{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #8b3fd9, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 600,
                }}
              >
                Umitcan Cinar
              </span>
              . Tum haklari saklidir.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 63, 217, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(139, 63, 217, 0.3)";
                  e.currentTarget.style.color = "#f1f5f9";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 63, 217, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, width: "0%" }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(139, 63, 217, 0.2), transparent)",
            marginTop: "1.5rem",
            marginBottom: "0.75rem",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            margin: 0,
            fontSize: "0.75rem",
            color: "#475569",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          Designed &amp; Built with{" "}
          <span style={{ color: "#f472b6" }}>&#9829;</span>
          {" "}by Umitcan Cinar
        </motion.p>
      </div>
    </motion.footer>
  );
}

export default Footer;
