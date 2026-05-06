import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Particle from "../Particle";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiPhone, FiMail, FiMapPin, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { sendContactMessage } from "../../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const socialLinks = [
    { icon: <FiGithub size={20} />, url: "https://github.com/umitcancinar", label: "GitHub", color: "#333" },
    { icon: <FiLinkedin size={20} />, url: "https://linkedin.com/in/umitcancinar", label: "LinkedIn", color: "#0A66C2" },
    { icon: <FaWhatsapp size={20} />, url: "https://wa.me/905541563862", label: "WhatsApp", color: "#25D366" },
    { icon: <FiTwitter size={20} />, url: "https://twitter.com/umitcancinar", label: "Twitter", color: "#1DA1F2" },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "İsim zorunludur";
    if (!formData.email.trim()) newErrors.email = "Email zorunludur";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Geçerli bir email adresi giriniz";
    if (!formData.subject.trim()) newErrors.subject = "Konu zorunludur";
    if (!formData.message.trim()) newErrors.message = "Mesaj zorunludur";
    else if (formData.message.trim().length < 10) newErrors.message = "Mesaj en az 10 karakter olmalıdır";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: "", text: "" });
    try {
      await sendContactMessage(formData);
      setStatus({ type: "success", text: "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım." });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.response?.data?.error || "Mesaj gönderilirken bir hata oluştu." });
    }
    setLoading(false);
  };

  const inputStyle = (hasError) => ({
    background: "rgba(255, 255, 255, 0.04)",
    border: hasError ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px", color: "#f1f5f9",
    padding: "0.75rem 1rem", fontSize: "0.9rem",
    transition: "all 0.3s ease", outline: "none", width: "100%",
  });

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="project-heading"><span className="purple">İletişim</span></h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto" }}>
            Bana ulaşmak için formu doldurabilir veya sosyal medya hesaplarımdan takip edebilirsiniz.
          </p>
        </motion.div>
        <Row className="g-4">
          <Col lg={7}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px",
                padding: "2rem", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" }}>
              <h3 style={{ color: "#f1f5f9", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
                Mesaj Gönder</h3>
              <AnimatePresence>
                {status.text && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <Alert variant={status.type === "success" ? "success" : "danger"}
                      style={{ background: status.type === "success" ? "rgba(52, 211, 153, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        border: status.type === "success" ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                        color: status.type === "success" ? "#34d399" : "#ef4444", borderRadius: "12px" }}>
                      {status.text}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
                        Ad Soyad <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                      <Form.Control type="text" name="name" value={formData.name}
                        onChange={handleChange} placeholder="Adınız Soyadınız" style={inputStyle(errors.name)} />
                      {errors.name && <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.name}</small>}
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
                        Email <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                      <Form.Control type="email" name="email" value={formData.email}
                        onChange={handleChange} placeholder="ornek@email.com" style={inputStyle(errors.email)} />
                      {errors.email && <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.email}</small>}
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
                    Konu <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                  <Form.Control type="text" name="subject" value={formData.subject}
                    onChange={handleChange} placeholder="Mesajınızın konusu" style={inputStyle(errors.subject)} />
                  {errors.subject && <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.subject}</small>}
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
                    Mesaj <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                  <Form.Control as="textarea" rows={5} name="message" value={formData.message}
                    onChange={handleChange} placeholder="Mesajınızı buraya yazın..." style={inputStyle(errors.message)} />
                  {errors.message && <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.message}</small>}
                </Form.Group>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" disabled={loading}
                    style={{ background: loading ? "rgba(139, 63, 217, 0.5)" : "linear-gradient(135deg, #8b3fd9, #f472b6)",
                      border: "none", borderRadius: "12px", padding: "0.75rem 2rem", fontSize: "1rem",
                      fontWeight: 600, color: "#fff", display: "inline-flex", alignItems: "center",
                      gap: "0.5rem", width: "100%", justifyContent: "center",
                      transition: "all 0.3s ease", cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "Gönderiliyor..." : <><FiSend size={18} /> Mesajı Gönder</>}
                  </Button>
                </motion.div>
              </Form>
            </motion.div>
          </Col>
          <Col lg={5}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { icon: <FiMail size={20} />, label: "Email", value: "cinarx04@gmail.com", href: "mailto:cinarx04@gmail.com" },
                { icon: <FiPhone size={20} />, label: "Telefon", value: "+90 554 156 38 62", href: "tel:+905541563862" },
                { icon: <FiMapPin size={20} />, label: "Konum", value: "İstanbul, Türkiye", href: null },
              ].map((info, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  style={{ background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(12px) saturate(180%)",
                    WebkitBackdropFilter: "blur(12px) saturate(180%)",
                    border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem" }}>
                  {info.href ? (
                    <a href={info.href} style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px",
                        background: "rgba(139, 63, 217, 0.15)", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "#8b3fd9", border: "1px solid rgba(139, 63, 217, 0.2)" }}>
                        {info.icon}</div>
                      <div><p style={{ color: "#94a3b8", margin: 0, fontSize: "0.8rem" }}>{info.label}</p>
                        <p style={{ color: "#f1f5f9", margin: 0, fontSize: "0.9rem", fontWeight: 500 }}>{info.value}</p></div>
                    </a>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px",
                        background: "rgba(139, 63, 217, 0.15)", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "#8b3fd9", border: "1px solid rgba(139, 63, 217, 0.2)" }}>
                        {info.icon}</div>
                      <div><p style={{ color: "#94a3b8", margin: 0, fontSize: "0.8rem" }}>{info.label}</p>
                        <p style={{ color: "#f1f5f9", margin: 0, fontSize: "0.9rem", fontWeight: 500 }}>{info.value}</p></div>
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                style={{ background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(12px) saturate(180%)",
                  WebkitBackdropFilter: "blur(12px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.5rem" }}>
                <h4 style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Sosyal Medya</h4>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {socialLinks.map((social, index) => (
                    <motion.a key={index} href={social.url} target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                      style={{ width: "48px", height: "48px", borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#94a3b8", textDecoration: "none", transition: "all 0.3s ease" }}
                      title={social.label}>{social.icon}</motion.a>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                style={{ background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(12px) saturate(180%)",
                  WebkitBackdropFilter: "blur(12px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", overflow: "hidden" }}>
                <iframe title="Konum"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d385405.13279686666!2d28.642893278023985!3d41.005371735230795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1690000000000"
                  width="100%" height="200" style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
