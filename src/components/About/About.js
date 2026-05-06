import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import Timeline from "./Timeline";
import useScrollReveal from "../../hooks/useScrollReveal";
import { fetchProjects as apiFetchProjects } from "../../services/api";

/* ─── Stagger Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1, x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

function About() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [sectionRef1, isVisible1] = useScrollReveal({ threshold: 0.05 });
  const [sectionRef2, isVisible2] = useScrollReveal({ threshold: 0.05 });
  const [sectionRef3, isVisible3] = useScrollReveal({ threshold: 0.05 });
  const [sectionRef4, isVisible4] = useScrollReveal({ threshold: 0.05 });
  const [sectionRef5, isVisible5] = useScrollReveal({ threshold: 0.05 });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await apiFetchProjects();
        const projects = data.projects || data;
        setFeaturedProjects(projects.slice(0, 3));
      } catch (error) {
        console.error("Projeler yüklenirken hata:", error);
      }
    };
    loadProjects();
  }, []);

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        {/* INTRO SECTION */}
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isVisible1 ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
          }}
        >
          <Row style={{ justifyContent: "center", padding: "10px" }}>
            <Col md={7} style={{ justifyContent: "center", paddingTop: "30px", paddingBottom: "50px" }}>
              <motion.h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }} variants={fadeUp}>
                KİM OLDUĞUMU <strong className="purple">TANIYIN</strong>
              </motion.h1>
              <motion.div variants={fadeUp}>
                <Aboutcard />
              </motion.div>
            </Col>
            <Col md={5} style={{ paddingTop: "120px", paddingBottom: "50px" }} className="about-img">
              <motion.div variants={fadeRight}>
                <motion.img
                  src={laptopImg} alt="about" className="img-fluid"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* EXPERIENCE TIMELINE */}
        <motion.div
          ref={sectionRef2}
          initial="hidden"
          animate={isVisible2 ? "visible" : "hidden"}
        >
          <Timeline />
        </motion.div>

        {/* SKILLS */}
        <motion.div
          ref={sectionRef3}
          initial="hidden"
          animate={isVisible3 ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
          }}
        >
          <motion.h1 className="project-heading" variants={fadeUp}>
            Profesyonel <strong className="purple">Yeteneklerim </strong>
          </motion.h1>
          <motion.div variants={fadeUp}>
            <Techstack />
          </motion.div>
        </motion.div>

        {/* TOOLS */}
        <motion.div
          ref={sectionRef4}
          initial="hidden"
          animate={isVisible4 ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
          }}
        >
          <motion.h1 className="project-heading" variants={fadeUp}>
            <strong className="purple">Kullandığım</strong> Araçlar
          </motion.h1>
          <motion.div variants={fadeUp}>
            <Toolstack />
          </motion.div>
        </motion.div>

        {/* GITHUB */}
        <motion.div
          ref={sectionRef5}
          initial="hidden"
          animate={isVisible5 ? "visible" : "hidden"}
        >
          <Github />
        </motion.div>

        {/* FEATURED PROJECTS FROM API */}
        {featuredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ paddingBottom: "50px" }}
          >
            <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
              Öne Çıkan <strong className="purple">Projeler</strong>
            </h1>
            <Row style={{ justifyContent: "center" }}>
              {featuredProjects.map((project, i) => (
                <Col md={4} className="project-card" key={project.id || i}>
                  <motion.div
                    className="project-card-view featured-project-card"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 80, damping: 12 }}
                    whileHover={{ scale: 1.03, y: -5, boxShadow: "0 12px 48px rgba(139, 63, 217, 0.3)" }}
                  >
                    <div className="featured-project-body">
                      <h3 style={{ color: "#f1f5f9", marginBottom: "10px" }}>
                        {project.title}
                      </h3>
                      <p style={{ color: "#94a3b8", fontSize: "0.9em", lineHeight: 1.6 }}>
                        {project.description?.length > 120
                          ? project.description.substring(0, 120) + "..."
                          : project.description}
                      </p>
                      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                        {project.githubUrl && (
                          <motion.a
                            href={project.githubUrl}
                            target="_blank" rel="noreferrer"
                            className="cta-btn cta-btn-outline"
                            style={{ padding: "0.4rem 1rem", fontSize: "0.85em" }}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          >
                            GitHub
                          </motion.a>
                        )}
                        {project.liveUrl && (
                          <motion.a
                            href={project.liveUrl}
                            target="_blank" rel="noreferrer"
                            className="cta-btn cta-btn-primary"
                            style={{ padding: "0.4rem 1rem", fontSize: "0.85em" }}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          >
                            Demo
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}
      </Container>
    </Container>
  );
}

export default About;