import React from "react";
import { Row } from "react-bootstrap";
import { motion } from "framer-motion";
import useScrollReveal from "../../hooks/useScrollReveal";

function Github() {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 14 }}
    >
      <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
        <motion.h1
          className="project-heading"
          style={{ paddingBottom: "20px" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Kodlama <strong className="purple">Günlüğüm</strong>
        </motion.h1>

        <motion.div
          style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet="https://raw.githubusercontent.com/umitcancinar/umitcancinar/output/github-contribution-grid-snake-dark.svg"
            />
            <source
              media="(prefers-color-scheme: light)"
              srcSet="https://raw.githubusercontent.com/umitcancinar/umitcancinar/output/github-contribution-grid-snake.svg"
            />
            <img
              src="https://raw.githubusercontent.com/umitcancinar/umitcancinar/output/github-contribution-grid-snake-dark.svg"
              alt="GitHub Contribution Snake Animation"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </picture>
        </motion.div>
      </Row>
    </motion.div>
  );
}

export default Github;