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

  // --- YEPYENİ VE DERTSİZ API (DEV.TO TECH NEWS) ---
  const fetchNews = async () => {
    try {
      // API Key YOK! Proxy YOK! CORS derdi YOK! Doğrudan çekiyoruz:
      const targetUrl = `https://dev.to/api/articles?tag=technology&top=1&per_page=10`;

      const response = await fetch(targetUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const formattedNews = data.map(article => ({
          title: article.title,
          description: article.description || "Haberi okumak için tıklayın...",
          url: article.url,
          urlToImage: article.social_image || "https://via.placeholder.com/500x250?text=Tech+News",
          publishedAt: new Date(article.published_at).toLocaleDateString(),
          source: { name: article.user.name } // Yazarın adını kaynak olarak gösterir
        }));
        
        setTechNews(formattedNews); 
      }
    } catch (error) {
      console.error("Yeni API Hatası:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (techNews.length === 0) return;
    const interval = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % techNews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [techNews]);

  useEffect(() => {
    if (!isPaused && !showModal) {
      const interval = setInterval(() => {
        setPostIndex(prev => (prev + 1) % myPosts.length);
      }, 3000);
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
          <Col md={6}>
            <h3 style={{ color: "white", textAlign: "left" }}>
              <BiNews /> Global Tech News (ENG)
            </h3>

            <Card className="project-card-view">
              <Card.Img
                variant="top"
                src={currentNews.urlToImage}
                alt="news"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x250?text=News";
                }}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#c770f0" }}>
                  {currentNews.title}
                </Card.Title>
                <Card.Text style={{ color: "white" }}>
                  {currentNews.description?.substring(0, 100)}...
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <h3 style={{ color: "white", textAlign: "left" }}>
              <BsPencilSquare /> Ümitcan'dan Notlar
            </h3>

            <Card
              className="project-card-view"
              onClick={() => openPost(myPosts[postIndex])}
            >
              <Card.Img
                variant="top"
                src={myPosts[postIndex].image}
                alt="blog"
                style={{ height: "280px", objectFit: "contain" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#c770f0" }}>
                  {myPosts[postIndex].title}
                </Card.Title>
                <Card.Text style={{ color: "white" }}>
                  {myPosts[postIndex].content.substring(0, 100)}...
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={selectedPost?.image}
            alt="Post"
            style={{ width: "100%", marginBottom: "20px" }}
          />
          <p>{selectedPost?.content}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Blog;