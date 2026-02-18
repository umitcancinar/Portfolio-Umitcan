import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

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

          {projects.map((project) => (
            <Col md={4} className="project-card" key={project.id}>
              <ProjectCard
                imgPath={project.imgPath}
                isBlog={false}
                title={project.title}
                description={project.description}
                ghLink={project.ghLink}
                demoLink={project.demoLink}
              />
            </Col>
          ))}

          {projects.length === 0 && (
            <p style={{ color: "white", textAlign: "center" }}>
              Henüz proje eklenmemiş veya yükleniyor...
            </p>
          )}

        </Row>
      </Container>
    </Container>
  );
}

export default Projects;