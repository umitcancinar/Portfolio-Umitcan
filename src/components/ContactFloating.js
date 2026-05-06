import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaArrowUp, FaTimes, FaEnvelope } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import emailjs from "@emailjs/browser";

function ContactFloating() {
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltip, setIsTooltip] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("Gonder");

  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Gonderiliyor...");

    emailjs.send(
      "service_16vkm4e", 
      "template_s8du82d", 
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: "cinarx04@gmail.com" 
      },
      "9veGJ4LMUoWBNguZ1"
    )
    .then(() => {
        setStatus("Basarili!");
        setTimeout(() => {
            setShowModal(false);
            setStatus("Gonder");
            setFormData({ name: "", email: "", phone: "", message: "" });
        }, 2000);
    }, (error) => {
        setStatus("Hata Olustu");
        console.log(error.text);
    });
  };

  // Floating action button stilleri
  const fabContainerStyle = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
  };

  const fabButtonStyle = (bgColor, size = "52px") => ({
    width: size,
    height: size,
    borderRadius: "50%",
    border: "none",
    backgroundColor: bgColor,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size === "52px" ? "1.3rem" : "1.1rem",
    cursor: "pointer",
    boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
    position: "relative",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  });

  const tooltipStyle = {
    position: "absolute",
    right: "calc(100% + 12px)",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(12, 10, 26, 0.9)",
    backdropFilter: "blur(12px)",
    color: "#f1f5f9",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
    fontWeight: 500,
    border: "1px solid rgba(255,255,255,0.08)",
    pointerEvents: "none",
  };

  return (
    <>
      <div style={fabContainerStyle}>
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ position: "relative" }}
              onMouseEnter={() => setActiveTooltip("scroll")}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                onClick={scrollToTop}
                style={{
                  ...fabButtonStyle("rgba(255,255,255,0.08)", "44px"),
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 63, 217, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(139, 63, 217, 0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(139, 63, 217, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                }}
                title="Yukari Cik"
              >
                <FaArrowUp size={16} />
              </button>
              {activeTooltip === "scroll" && (
                <div style={tooltipStyle}>Yukari Cik</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email / Contact Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ position: "relative" }}
          onMouseEnter={() => setActiveTooltip("email")}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <button
            onClick={() => setShowModal(true)}
            style={{
              ...fabButtonStyle("#8b3fd9", "56px"),
              boxShadow: "0 4px 20px rgba(139, 63, 217, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(139, 63, 217, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 63, 217, 0.4)";
            }}
            title="Proje Baslat"
          >
            <MdEmail size={24} />
          </button>
          {activeTooltip === "email" && (
            <div style={tooltipStyle}>Projeni Anlat</div>
          )}
        </motion.div>

        {/* WhatsApp Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ position: "relative" }}
          onMouseEnter={() => setActiveTooltip("whatsapp")}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <a
            href="https://wa.me/905541563862"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...fabButtonStyle("#25D366", "56px"),
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(37, 211, 102, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(37, 211, 102, 0.4)";
            }}
            title="WhatsApp"
          >
            <FaWhatsapp size={24} />
          </a>
          {activeTooltip === "whatsapp" && (
            <div style={tooltipStyle}>WhatsApp</div>
          )}
        </motion.div>
      </div>

      {/* Iletisim Formu (Modal) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{
          background: "rgba(28, 22, 64, 0.95)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(139, 63, 217, 0.2)",
        }}>
          <Modal.Title style={{ color: "#f1f5f9", fontWeight: 600 }}>
            Projeni Anlat, Baslayalim!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          background: "rgba(28, 22, 64, 0.95)",
          backdropFilter: "blur(24px)",
          color: "#f1f5f9",
        }}>
          <Form onSubmit={sendEmail}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Adin Soyadin</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange}
                required placeholder="Orn: Ahmet Yilmaz"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "white", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "0.6rem 1rem",
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Email Adresin</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}
                required placeholder="mail@ornek.com"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "white", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "0.6rem 1rem",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Telefon Numaran</Form.Label>
              <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="05XX XXX XX XX"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "white", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "0.6rem 1rem",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Proje Ozeti / Mesajin</Form.Label>
              <Form.Control as="textarea" name="message" value={formData.message} onChange={handleChange}
                required rows={3} placeholder="Aklindaki projeden kisaca bahset..."
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "white", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", padding: "0.6rem 1rem",
                }}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit"
                style={{
                  background: "linear-gradient(135deg, #8b3fd9, #f472b6)",
                  border: "none", fontWeight: 600, padding: "0.7rem",
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 63, 217, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {status}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ContactFloating;
