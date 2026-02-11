import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import Particle from "../Particle";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";

import blog1 from "../../Assets/blog1.png"; 
import blog2 from "../../Assets/blog2.png"; 
import blog3 from "../../Assets/blog3.png"; 
import blog4 from "../../Assets/blog4.png";
import blog5 from "../../Assets/blog5.png";

const fallbackNews = [
  {
    title: "The AI Revolution",
    description: "Generative AI is reshaping how we work, code, and create content globally.",
    url: "https://wired.com",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    publishedAt: "Editor's Pick",
    source: { name: "Wired" }
  },
  {
    title: "Quantum Computing",
    description: "Scientists achieve new milestone in stable qubits at room temperature.",
    url: "https://techcrunch.com",
    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
    publishedAt: "Top Story",
    source: { name: "TechCrunch" }
  }
];

const myPosts = [
  {
    id: 1,
    title: "TBM Akran Eğitimi Sunumu",
    content: "Değerli eğitmenlerden değerli eğitimler alarak sonuca erdirdiğimiz bu kamp maceramızın son gününde sınav ve sunum yaptık. Sunumumuz çok beğenildi :)",
    date: "6 Şubat 2026",
    image: blog1
  },
  {
    id: 2,
    title: "Belge Töreni",
    content: "Eğitimler ve sınavlar sonucu bu değerli belgeyi almaya hak kazandım.",
    date: "6 Şubat 2026",
    image: blog2
  },
  {
    id: 3,
    title: "Online Kod Editörüm Yayında!",
    content: "Uzun zamandır üzerinde çalıştığım API ile çalışan online kod editörüm KODASISTANIM yayında. Hemen deneyin!",
    date: "1 Şubat 2026",
    image: blog3
  },
  {
    id: 4,
    title: "Dostlarla Haklı Gurur",
    content: "Zorlu sürecin sonunda sertifikalarımızı aldık. Haklı gurur.",
    date: "6 Şubat 2026",
    image: blog4
  },
  {
    id: 5,
    title: "Dostlarla Toplu Fotoğraf :)",
    content: "Hepsi birbirinden kıymetli dostlara selam olsun!",
    date: "5 Şubat 2026",
    image: blog5
  }
];

function Blog() {
  const [techNews, setTechNews] = useState(fallbackNews);
  const [newsIndex, setNewsIndex] = useState(0);
  const [postIndex, setPostIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Havalı Stok Resim Yedeği
  const defaultTechImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80";

  // --- EFSANE API: SAURAV NEWSAPI KLONU (Limit yok, CORS yok, 100% Kalite) ---
  const fetchNews = async () => {
    try {
      const targetUrl = `https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json`;
      const response = await fetch(targetUrl);
      const data = await response.json();

      // Sadece resimli ve düzgün başlığı olan haberleri filtreliyoruz (bozuk haber gelmesin diye)
      if (data && data.articles && data.articles.length > 0) {
        const validArticles = data.articles.filter(article => article.title && article.urlToImage);
        
        const formattedNews = validArticles.map(article => ({
          title: article.title,
          description: article.description ? article.description.substring(0, 100) + "..." : "Haberi okumak için tıklayın...",
          url: article.url,
          urlToImage: article.urlToImage || defaultTechImage,
          publishedAt: new Date(article.publishedAt).toLocaleDateString(),
          source: { name: article.source.name } 
        }));
        
        if (formattedNews.length > 0) {
           setTechNews(formattedNews); 
        }
      }
    } catch (error) {
      console.error("API Hatası:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Haberleri 4 saniyede bir kaydır (Okuması daha rahat olsun diye 3'ten 4'e çıkardım)
  useEffect(() => {
    if (techNews.length === 0) return;
    const interval = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % techNews.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [techNews]);

  useEffect(() => {
    if (!isPaused && !showModal) {
      const interval = setInterval(() => {
        setPostIndex(prev => (prev + 1) % myPosts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused, showModal]);

  const handleNextNews = () => setNewsIndex(prev => (prev + 1) % techNews.length);
  const handlePrevNews = () => setNewsIndex(prev => (prev - 1 + techNews.length) % techNews.length);
  const handleNextPost = () => setPostIndex(prev => (prev + 1) % myPosts.length);
  const handlePrevPost = () => setPostIndex(prev => (prev - 1 + myPosts.length) % myPosts.length);

  const openPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    setIsPaused(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsPaused(false);
  };

  const currentNews = techNews[newsIndex] || fallbackNews[0];

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Teknoloji <strong className="purple">Gündemi </strong> & <strong className="purple">Blog</strong>
        </h1>

        <Row style={{ marginTop: "50px" }}>
          
          {/* --- SOL TARAF: GLOBAL HABERLER --- */}
          <Col md={6} className="mb-5">
            <h3 style={{ color: "white", textAlign: "left" }}>
              <BiNews /> Global Tech News (ENG)
            </h3>

            <Card className="project-card-view" style={{ minHeight: "500px", position: "relative" }}>
              <Card.Img
                variant="top"
                src={currentNews.urlToImage}
                alt="news"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultTechImage; 
                }}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body style={{ textAlign: "left" }}>
                <Card.Title style={{ color: "#c770f0", fontWeight: "bold" }}>
                  {currentNews.title}
                </Card.Title>
                <Card.Text style={{ color: "white" }}>
                  {currentNews.description}
                </Card.Text>
                
                {/* TIKLANABİLİR BUTON! */}
                <Button variant="primary" href={currentNews.url} target="_blank" size="sm" style={{ marginTop: "10px" }}>
                   Read More &rarr;
                </Button>
                
                <div style={{ marginTop: "15px", color: "gray", fontSize: "0.8em", fontWeight: "bold" }}>
                   Source: {currentNews.source?.name} | {currentNews.publishedAt}
                </div>
              </Card.Body>

              {/* SAĞA SOLA KAYDIRMA OKLARI! */}
              <div style={{ position: "absolute", top: "50%", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 10px", transform: "translateY(-50%)" }}>
                 <Button variant="dark" onClick={handlePrevNews} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowLeft /> </Button>
                 <Button variant="dark" onClick={handleNextNews} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowRight /> </Button>
              </div>
            </Card>
          </Col>

          {/* --- SAĞ TARAF: KİŞİSEL BLOG --- */}
          <Col md={6} className="mb-5">
            <h3 style={{ color: "white", textAlign: "left" }}>
              <BsPencilSquare /> Ümitcan'dan Notlar
            </h3>

            <Card
              className="project-card-view"
              style={{ minHeight: "500px", position: "relative", cursor: "pointer", border: "2px solid #c770f0" }}
              onClick={() => openPost(myPosts[postIndex])}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Card.Img
                variant="top"
                src={myPosts[postIndex].image}
                alt="blog"
                style={{ height: "280px", objectFit: "contain", backgroundColor: "#000", padding: "5px" }}
              />
              <Card.Body style={{ textAlign: "left" }}>
                <Card.Title style={{ color: "#c770f0", fontWeight: "bold" }}>
                  {myPosts[postIndex].title}
                </Card.Title>
                <Card.Text style={{ color: "white" }}>
                  {myPosts[postIndex].content.substring(0, 100)}...
                </Card.Text>
              </Card.Body>
              
              <div style={{ position: "absolute", top: "50%", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 10px", transform: "translateY(-50%)" }}>
                 <Button variant="dark" onClick={(e) => {e.stopPropagation(); handlePrevPost();}} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowLeft /> </Button>
                 <Button variant="dark" onClick={(e) => {e.stopPropagation(); handleNextPost();}} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowRight /> </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1c1c1c", borderBottom: "1px solid #c770f0" }}>
          <Modal.Title style={{ color: "#c770f0" }}>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#171717", color: "white" }}>
          <img
            src={selectedPost?.image}
            alt="Post"
            style={{ width: "100%", maxHeight: "400px", objectFit: "contain", backgroundColor: "#000", borderRadius: "10px", marginBottom: "20px" }}
          />
          <p style={{ fontSize: "1.1em", lineHeight: "1.6", textAlign: "justify" }}>{selectedPost?.content}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Blog;