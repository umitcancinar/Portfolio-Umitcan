import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import myImg from "../../Assets/avatar.png";
import Tilt from "react-parallax-tilt";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import useScrollReveal from "../../hooks/useScrollReveal";

/* ─── Stagger Variants ─── */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

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

function Home2() {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <motion.div
          ref={sectionRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <Row>
            <Col md={8} className="home-about-description">
              <motion.h1 style={{ fontSize: "2.6em" }} variants={fadeUp}>
                KENDİMİ <span className="purple"> TANITAYIM </span>
              </motion.h1>
              <motion.p className="home-about-body" variants={fadeUp}>
                Ben, fikirleri güvenilir ve ölçeklenebilir ürünlere dönüştürmeyi seven bir Yazılım Mühendisiyim.
                <br /><br />
                Şu dillerde yetkinliğim var:
                <i>
                  <b className="purple"> Java ve JavaScript </b>
                </i>
                <br /><br />
                İlgi alanlarımın başında
                <i>
                  <b className="purple"> Web Uygulamaları </b>
                </i>
                geliştirmek ve modern teknolojileri keşfetmek geliyor.
                <br /><br />
                Projelerimi genellikle
                <b className="purple"> Modern Javascript Kütüphaneleri</b> ve
                <i>
                  <b className="purple"> Java </b>
                </i>
                teknolojileri ile geliştirmeyi tercih ediyorum.
              </motion.p>
            </Col>
            <Col md={4} className="myAvtar">
              <motion.div variants={fadeRight}>
                <Tilt>
                  <img src={myImg} className="img-fluid" alt="avatar" />
                </Tilt>
              </motion.div>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="home-about-social">
              <motion.h1 variants={fadeUp}>SOSYAL MEDYA</motion.h1>
              <motion.p variants={fadeUp}>
                Benimle <span className="purple">iletişime </span> geçmekten çekinmeyin
              </motion.p>
              <motion.ul className="home-about-social-links" variants={fadeUp}>
                <li className="social-icons">
                  <motion.a
                    href="https://github.com/umitcancinar"
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AiFillGithub />
                  </motion.a>
                </li>
                <li className="social-icons">
                  <motion.a
                    href="https://www.linkedin.com/in/umitcancinar/"
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLinkedinIn />
                  </motion.a>
                </li>
              </motion.ul>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </Container>
  );
}
export default Home2;