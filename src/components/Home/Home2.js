import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// DİKKAT: Burayı .png yaptık. Resim dosyan src/Assets/avatar.png olmalı.
import myImg from "../../Assets/avatar.png";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              KENDİMİ <span className="purple"> TANITAYIM </span>
            </h1>
            <p className="home-about-body">
              Ben, fikirleri güvenilir ve ölçeklenebilir ürünlere dönüştürmeyi seven bir Yazılım Mühendisiyim.
              <br />
              <br />
              Şu dillerde yetkinliğim var:
              <i>
                <b className="purple"> Java ve JavaScript </b>
              </i>
              <br />
              <br />
              İlgi alanlarımın başında
              <i>
                <b className="purple">
                  {" "}
                  Web Uygulamaları{" "}
                </b>
              </i>
              geliştirmek ve modern teknolojileri keşfetmek geliyor.
              <br />
              <br />
              Projelerimi genellikle
              <b className="purple"> Modern Javascript Kütüphaneleri</b> ve
              <i>
                <b className="purple"> Java </b>
              </i>
              teknolojileri ile geliştirmeyi tercih ediyorum.
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>SOSYAL MEDYA</h1>
            <p>
              Benimle <span className="purple">iletişime </span> geçmekten çekinmeyin
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/umitcancinar"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/umitcancinar/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;