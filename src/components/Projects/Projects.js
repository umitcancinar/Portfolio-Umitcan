import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";

// Proje Görsellerinin İçe Aktarılması
// NOT: Bu dosyaların src/Assets/Projects/ klasöründe .png uzantılı olarak bulunduğundan emin ol.
import algovisProImg from "../../Assets/Projects/algovispro1.png";
import kodAsistanimImg from "../../Assets/Projects/kodasistanim1.png";
import algoLotoImg from "../../Assets/Projects/algolotokazandirir1.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Son <strong className="purple">Çalışmalarım </strong>
        </h1>
        <p style={{ color: "white" }}>
          İşte üzerinde çalıştığım bazı önemli projeler.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={algovisProImg}
              isBlog={false}
              title="AlgovisPro"
              description="Binary ve Linear Search algoritmalarının çalışma mantığını karşılaştırmalı olarak gösteren görselleştirme aracı. Algoritmaların karmaşıklığını anlamak için interaktif bir deneyim sunar."
              ghLink="https://github.com/umitcancinar/AlgoVis_WebApp"
              demoLink="https://algovispro.netlify.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={kodAsistanimImg}
              isBlog={false}
              title="KodAsistanım"
              description="Kullanıcıların tarayıcı üzerinden kod yazıp çalıştırabileceği, kendi geliştirdiğim online IDE projesi. Modern web teknolojileri kullanılarak, hızlı ve kullanıcı dostu bir kodlama ortamı sağlamak amacıyla tasarlandı."
              ghLink="https://github.com/umitcancinar/KODASISTANIM.WEBAPP"
              demoLink="https://kodasistanim.netlify.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={algoLotoImg}
              isBlog={false}
              title="AlgoLotoKazandırır"
              description="JavaScript'in Math.random() fonksiyonunun çalışma mantığını eğlenceli ve mizahi bir yolla kavratmak için tasarlanmış interaktif web sitesi."
              ghLink="https://github.com/umitcancinar/Math.random-interactive-game-web-"
              demoLink="https://algolotokazandirir.netlify.app/"
            />
          </Col>

        </Row>
      </Container>
    </Container>
  );
}

export default Projects;