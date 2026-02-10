import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import emailjs from "@emailjs/browser";

function ContactFloating() {
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Form Verileri
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("Gönder"); // Buton yazısı (Gönderiliyor...)

  // --- SCROLL TAKİBİ (Roket butonunu göstermek için) ---
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // --- FORM İŞLEMLERİ ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Gönderiliyor...");

    // ⚠️ BURAYI KENDİ EMAILJS BİLGİLERİNLE DOLDURACAKSIN (Aşağıda anlatacağım)
    // Servis ID, Şablon ID, Public Key
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
    .then((result) => {
        setStatus("Başarılı! ✅");
        setTimeout(() => {
            setShowModal(false);
            setStatus("Gönder");
            setFormData({ name: "", email: "", phone: "", message: "" });
        }, 2000);
    }, (error) => {
        setStatus("Hata Oluştu ❌");
        console.log(error.text);
    });
  };

  return (
    <>
      {/* --- SAĞ ALT KÖŞE BUTONLARI --- */}
      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: "9999", display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* 1. YUKARI ÇIK ROKETİ (Sadece aşağı inince görünür) */}
        {isVisible && (
          <Button 
            className="floating-btn"
            onClick={scrollToTop}
            style={{ borderRadius: "50%", width: "50px", height: "50px", backgroundColor: "#333", border: "2px solid #c770f0" }}
          >
            <FaArrowUp color="white" />
          </Button>
        )}

        {/* 2. MAİL / İLETİŞİM FORMU BUTONU */}
        <Button 
            className="floating-btn"
            onClick={() => setShowModal(true)}
            style={{ borderRadius: "50%", width: "60px", height: "60px", backgroundColor: "#c770f0", border: "none", fontSize: "1.5rem" }}
            title="Proje Başlat"
        >
          <MdEmail color="white" />
        </Button>

        {/* 3. WHATSAPP BUTONU */}
        <Button 
            className="floating-btn"
            href="https://wa.me/905541563862"
            target="_blank"
            style={{ borderRadius: "50%", width: "60px", height: "60px", backgroundColor: "#25D366", border: "none", fontSize: "1.5rem" }}
            title="WhatsApp'tan Yaz"
        >
          <FaWhatsapp color="white" />
        </Button>
      </div>

      {/* --- İLETİŞİM FORMU (MODAL) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1c1c1c", borderBottom: "1px solid #c770f0" }}>
          <Modal.Title style={{ color: "#c770f0" }}>Projeni Anlat, Başlayalım!</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#171717", color: "white" }}>
          <Form onSubmit={sendEmail}>
            <Form.Group className="mb-3">
              <Form.Label>Adın Soyadın</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Örn: Ahmet Yılmaz" style={{ background: "#222", color: "white", border: "1px solid #555" }} />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email Adresin</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="mail@ornek.com" style={{ background: "#222", color: "white", border: "1px solid #555" }} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon Numaran</Form.Label>
              <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="05XX XXX XX XX" style={{ background: "#222", color: "white", border: "1px solid #555" }} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Proje Özeti / Mesajın</Form.Label>
              <Form.Control as="textarea" name="message" value={formData.message} onChange={handleChange} required rows={3} placeholder="Aklındaki projeden kısaca bahset..." style={{ background: "#222", color: "white", border: "1px solid #555" }} />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" style={{ backgroundColor: "#c770f0", border: "none", fontWeight: "bold" }}>
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