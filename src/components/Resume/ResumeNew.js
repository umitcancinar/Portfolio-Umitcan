import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/CV_Umitcan_Cinar.pdf";
import { AiOutlineDownload, AiOutlineCalendar, AiOutlineStar } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { MdSchool, MdWork, MdVerified } from "react-icons/md";
import { Document, Page, pdfjs } from "react-pdf";
import { motion } from "framer-motion";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const experiences = [
  {
    id: 1, role: "Full Stack Developer", company: "Freelance", period: "2023 - Present",
    description: ["Modern web uygulamaları geliştirme (React, Node.js, PostgreSQL)", "RESTful API tasarımı ve implementasyonu", "Müşteri gereksinimlerine özel çözümler üretme", "Performans optimizasyonu ve deployment süreçleri"], type: "work"
  },
  {
    id: 2, role: "Software Development Intern", company: "TBM Akran Eğitimi", period: "2025 - 2026",
    description: ["Akran eğitimi kapsamında yazılım geliştirme süreçlerine katılım", "Takım çalışması ve proje yönetimi deneyimi", "Teknik sunum ve dokümantasyon hazırlama"], type: "work"
  },
];

const education = [
  {
    id: 1, degree: "Bilgisayar Programcılığı", school: "İstanbul Üniversitesi", period: "2023 - 2025",
    description: "Bilgisayar programcılığı alanında ön lisans eğitimi"
  },
  {
    id: 2, degree: "Full Stack Web Development Bootcamp", school: "Online Platform", period: "2023",
    description: "Modern web teknolojileri üzerine yoğunlaştırılmış bootcamp programı"
  },
];

const certifications = [
  { id: 1, title: "React Frontend Developer", issuer: "Meta (Coursera)", date: "2024", link: "#" },
  { id: 2, title: "Node.js Backend Development", issuer: "IBM (Coursera)", date: "2024", link: "#" },
  { id: 3, title: "TBM Akran Eğitimi Sertifikası", issuer: "TBM", date: "2026", link: "#" },
];

function TimelineItem({ item, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", position: "relative", paddingLeft: "0.5rem" }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "12px",
        background: "linear-gradient(135deg, rgba(139, 63, 217, 0.2), rgba(244, 114, 182, 0.2))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1rem", color: "#8b3fd9",
        border: "1px solid rgba(139, 63, 217, 0.2)", flexShrink: 0, zIndex: 1, position: "relative",
      }}>
        {icon}
      </div>
      <div style={{
        flex: 1,
        background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h5 style={{ color: "#f1f5f9", margin: 0, fontSize: "1rem", fontWeight: 600 }}>{item.role}</h5>
            <p style={{ color: "#8b3fd9", margin: "0.25rem 0", fontSize: "0.85rem" }}>{item.company}</p>
          </div>
          <span style={{
            background: "rgba(139, 63, 217, 0.12)", color: "#b07ce6",
            padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", whiteSpace: "nowrap",
          }}>
            {item.period}
          </span>
        </div>
        <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1rem", color: "#94a3b8", fontSize: "0.8rem" }}>
          {item.description.map((desc, i) => (
            <li key={i} style={{ marginBottom: "0.25rem" }}>{desc}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ResumeNew() {

  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const sectionTitleStyle = {
    fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9",
    marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem",
  };

  const sectionIconStyle = {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, rgba(139, 63, 217, 0.2), rgba(244, 114, 182, 0.2))",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1rem", color: "#8b3fd9", border: "1px solid rgba(139, 63, 217, 0.2)",
  };

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Container>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 className="project-heading" style={{ marginBottom: "1rem" }}>
              <span className="purple">Özgeçmiş</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
              Profesyonel deneyimlerim, eğitim hayatım ve sertifikalarım.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: "inline-block" }}>
              <Button href={pdf} target="_blank" download="CV_Umitcan_Cinar.pdf"
                style={{
                  background: "linear-gradient(135deg, #8b3fd9, #f472b6)", border: "none",
                  borderRadius: "12px", padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 600,
                  color: "#fff", display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  boxShadow: "0 4px 20px rgba(139, 63, 217, 0.3)",
                  transition: "all 0.3s ease",
                }}>
                <AiOutlineDownload size={20} /> CV'yi İndir
              </Button>
            </motion.div>
          </motion.div>

          {/* PDF Viewer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
              WebkitBackdropFilter: "blur(12px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px",
              padding: "2rem", marginBottom: "3rem", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}>
            <div style={{ display: "flex", justifyContent: "center", minHeight: "200px" }}>
              <Document file={pdf} className="d-flex justify-content-center">
                <Page pageNumber={1} scale={width > 992 ? 1.5 : width > 786 ? 1.2 : 0.6}
                  renderTextLayer={false} renderAnnotationLayer={false} canvasBackground="transparent" />
              </Document>
            </div>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }} style={{ marginBottom: "3rem" }}>
            <div style={sectionTitleStyle}>
              <div style={sectionIconStyle}><MdWork /></div> Deneyim
            </div>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", left: "2rem", top: 0, width: "2px",
                height: "calc(100% - 1rem)", background: "linear-gradient(180deg, #8b3fd9, #f472b6, transparent)", opacity: 0.3
              }} />
              {experiences.map((exp, index) => (
                <TimelineItem key={exp.id} item={exp} index={index} icon={<MdWork size={20} />} />
              ))}
            </div>
          </motion.div>

          {/* Education & Certifications */}
          <Row>
            <Col md={6} className="mb-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}>
                <div style={sectionTitleStyle}>
                  <div style={sectionIconStyle}><MdSchool /></div> Eğitim
                </div>
                {education.map((edu, index) => (
                  <motion.div key={edu.id} initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(12px) saturate(180%)",
                      WebkitBackdropFilter: "blur(12px) saturate(180%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px",
                      padding: "1.25rem", marginBottom: "1rem",
                      borderLeft: "3px solid #8b3fd9",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h5 style={{ color: "#f1f5f9", margin: 0, fontSize: "1rem", fontWeight: 600 }}>{edu.degree}</h5>
                        <p style={{ color: "#8b3fd9", margin: "0.25rem 0", fontSize: "0.85rem" }}>{edu.school}</p>
                      </div>
                      <span style={{
                        background: "rgba(139, 63, 217, 0.12)", color: "#b07ce6",
                        padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", whiteSpace: "nowrap"
                      }}>
                        {edu.period}
                      </span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0.5rem 0 0" }}>{edu.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Col>
            <Col md={6} className="mb-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}>
                <div style={sectionTitleStyle}>
                  <div style={sectionIconStyle}><MdVerified /></div> Sertifikalar
                </div>
                {certifications.map((cert, index) => (
                  <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(12px) saturate(180%)",
                      WebkitBackdropFilter: "blur(12px) saturate(180%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px",
                      padding: "1.25rem", marginBottom: "1rem",
                      borderLeft: "3px solid #f472b6",
                    }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: "rgba(244, 114, 182, 0.15)", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "0.9rem", color: "#f472b6", flexShrink: 0
                      }}>
                        <AiOutlineStar />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ color: "#f1f5f9", margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>{cert.title}</h5>
                        <p style={{ color: "#94a3b8", margin: "0.15rem 0", fontSize: "0.8rem" }}>
                          {cert.issuer} · {cert.date}
                        </p>
                        {cert.link && (
                          <a href={cert.link} target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#f472b6", fontSize: "0.8rem", textDecoration: "none" }}>
                            <FiExternalLink size={12} /> Göster
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Col>
          </Row>

          {/* Bottom Download */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "2rem" }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: "inline-block" }}>
              <Button href={pdf} target="_blank" download="CV_Umitcan_Cinar.pdf"
                style={{
                  background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(139, 63, 217, 0.3)",
                  borderRadius: "12px", padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 500,
                  color: "#f1f5f9", display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  backdropFilter: "blur(8px)", transition: "all 0.3s ease",
                }}>
                <AiOutlineDownload size={18} /> CV'yi PDF Olarak İndir
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Container>
    </div>
  );
}

export default ResumeNew;
