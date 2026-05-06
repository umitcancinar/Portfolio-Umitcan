import React from "react";
import { Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import macOs from "../../Assets/TechIcons/Apple MacOSX.svg";
import chrome from "../../Assets/TechIcons/Google Chrome.svg";
import vsCode from "../../Assets/TechIcons/vscode.svg";
import intelliJ from "../../Assets/TechIcons/intellij-idea.svg";
import gitIcon from "../../Assets/TechIcons/Git.svg";
import postman from "../../Assets/TechIcons/Postman.svg";
import docker from "../../Assets/TechIcons/Docker.svg";
import useScrollReveal from "../../hooks/useScrollReveal";

const tools = [
  { img: macOs, name: "Mac OS" },
  { img: chrome, name: "Chrome" },
  { img: vsCode, name: "VS Code" },
  { img: intelliJ, name: "IntelliJ" },
  { img: gitIcon, name: "Git" },
  { img: postman, name: "Postman" },
  { img: docker, name: "Docker" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      delay: i * 0.1,
    },
  }),
};

function Toolstack() {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <Row
      ref={sectionRef}
      style={{ justifyContent: "center", paddingBottom: "50px" }}
    >
      {tools.map((tool, i) => (
        <Col key={i} xs={4} md={2} className="tech-icons-wrapper">
          <motion.div
            className="tech-icons tool-icon-card"
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            whileHover={{
              scale: 1.12,
              y: -6,
              boxShadow: "0 12px 32px rgba(139, 63, 217, 0.4)",
              borderColor: "rgba(139, 63, 217, 0.7)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={tool.img}
              alt={tool.name}
              className="tech-icon-images"
              style={{ filter: "brightness(1.2) drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
            />
            <div className="tech-icons-text">{tool.name}</div>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
}

export default Toolstack;
