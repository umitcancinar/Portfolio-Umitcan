import React from "react";
import { Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiJava,
  DiGit,
} from "react-icons/di";
import { SiNextdotjs } from "react-icons/si";
import useScrollReveal from "../../hooks/useScrollReveal";

const techIcons = [
  { icon: <DiJava />, name: "Java" },
  { icon: <DiJavascript1 />, name: "JavaScript" },
  { icon: <DiNodejs />, name: "Node.js" },
  { icon: <DiReact />, name: "React" },
  { icon: <SiNextdotjs />, name: "Next.js" },
  { icon: <DiGit />, name: "Git" },
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

function Techstack() {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <Row
      ref={sectionRef}
      style={{ justifyContent: "center", paddingBottom: "50px" }}
    >
      {techIcons.map((tech, i) => (
        <Col key={i} xs={4} md={2} className="tech-icons-wrapper">
          <motion.div
            className="tech-icons"
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
            <div className="tech-icon-inner">
              {tech.icon}
              <span className="tech-label">{tech.name}</span>
            </div>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
}

export default Techstack;