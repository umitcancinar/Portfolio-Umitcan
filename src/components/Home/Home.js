import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, useInView } from "framer-motion";
import homeLogo from "../../Assets/home-main.png";
import Particle from "../Particle";
import Type from "./Type";
import Home2 from "./Home2";

/* ─── Framer Motion Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const profileVariants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -10 },
  visible: {
    opacity: 1, scale: 1, rotate: 0,
    transition: { type: "spring", stiffness: 100, damping: 12, delay: 0.4 },
  },
};

/* ─── Scroll Down Indicator ─── */
function ScrollIndicator() {
  return (
    <motion.div
      className="scroll-indicator"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <motion.div
        className="scroll-mouse"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
          <rect x="2" y="2" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/>
          <motion.circle
            cx="12" cy="10" r="3" fill="#8b3fd9"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      <span className="scroll-text">Aşağı Kaydır</span>
    </motion.div>
  );
}

/* ─── Main Home Component ─── */
function Home() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <section ref={heroRef}>
      {/* HERO SECTION */}
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
          >
            <Row>
              <Col md={7} className="home-header">
                <motion.h1 className="heading" variants={itemVariants} style={{ paddingBottom: 15 }}>
                  Merhaba!{" "}
                  <motion.span
                    className="wave" role="img" aria-labelledby="wave"
                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ display: "inline-block" }}
                  >
                    👋🏻
                  </motion.span>
                </motion.h1>

                <motion.h1 className="heading-name" variants={itemVariants}>
                  Ben
                  <strong className="main-name"> ÜMİTCAN ÇİNAR</strong>
                </motion.h1>

                <motion.div style={{ padding: "50px 0 50px 50px", textAlign: "left" }} variants={itemVariants}>
                  <Type />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div className="cta-buttons" variants={itemVariants}
                  style={{ paddingLeft: 50, display: "flex", gap: 16, flexWrap: "wrap" }}
                >
                  <motion.a href="/project" className="cta-btn cta-btn-primary"
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  >
                    <span>Projelerimi Gör</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </motion.a>

                  <motion.a href="#about" className="cta-btn cta-btn-secondary"
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>İletişime Geç</span>
                  </motion.a>

                  <motion.a href="/CV_Umitcan_Cinar.pdf" download className="cta-btn cta-btn-outline"
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>CV İndir</span>
                  </motion.a>
                </motion.div>
              </Col>

              {/* Profile Image */}
              <Col md={5} style={{ paddingBottom: 20 }} className="profile-col">
                <motion.div variants={profileVariants} className="profile-image-wrapper">
                  <motion.div className="profile-glow"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.img
                    src={homeLogo} alt="home pic"
                    className="img-fluid profile-image"
                    style={{ maxHeight: "450px", position: "relative", zIndex: 2 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </Container>

      {/* ABOUT PREVIEW SECTION */}
      <Home2 />
    </section>
  );
}

export default Home;
