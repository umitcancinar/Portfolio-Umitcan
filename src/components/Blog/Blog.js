import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import Particle from "../Particle";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";

// 👇👇👇 RESİMLERİ BURADA DÜZELTTİM 👇👇👇
// Assets klasöründe blog4.png ve blog5.png olduğundan emin ol!
import blog1 from "../../Assets/blog1.png"; 
import blog2 from "../../Assets/blog2.png"; 
import blog3 from "../../Assets/blog3.png"; 
import blog4 from "../../Assets/blog4.png"; // <--- ARTIK KENDİ RESMİNİ ÇEKECEK
import blog5 from "../../Assets/blog5.png"; // <--- ARTIK KENDİ RESMİNİ ÇEKECEK

// --- GARANTİ YEDEK HABERLER (Global) ---
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

// 👇👇👇 SAĞ TARAF: SENİN BLOG YAZILARIN (5 TANE) 👇👇👇
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
    image: blog4 // <--- ARTIK YENİ RESİM GELECEK
  },
  {
    id: 5,
    title: "Dostlarla Toplu Fotoğraf :)",
    content: "Hepsi birbirinden kıymetli dostlara selam olsun!",
    date: "5 Şubat 2026",
    image: blog5 // <--- ARTIK YENİ RESİM GELECEK
  }
];

function Blog() {
  const [techNews, setTechNews] = useState(fallbackNews);
  const [newsIndex, setNewsIndex] = useState(0);
  const [postIndex, setPostIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // --- API VERİ ÇEKME (GNEWS API + CORS PROXY + DEDEKTİF MODU) ---
  const fetchNews = async () => {
    try {
      const apiKey = "1dfaf03a4227c476387444c64edfd11c"; 
      
      const targetUrl = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=10&apikey=${apiKey}`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

      console.log("📡 API'ye istek atılıyor..."); // BAŞLANGIÇ SİNYALİ

      const response = await fetch(proxyUrl);
      const data = await response.json();

      console.log("🔥 API'DEN GELEN CEVAP (SUÇLU BURADA):", data); // GELEN VERİYİ KONSOLA YAZDIR

      if (data.articles && data.articles.length > 0) {
        console.log("✅ Haberler başarıyla alındı!");
        const formattedNews = data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.publishedAt,
          source: { name: article.source.name }
        }));
        setTechNews(formattedNews); 
      } else {
        console.warn("⚠️ API cevap verdi ama içinde 'articles' dizisi yok! Limit dolmuş veya URL hatalı olabilir.");
      }
    } catch (error) {
      console.error("❌ API Hatası (Fetch Patladı):", error);
    }
  };

  // --- SOL TARAF OTOMATİK KAYDIRMA (3 SANİYE) ---
  useEffect(() => {
    const interval = setInterval(() => {
        setNewsIndex((prev) => (prev + 1) % techNews.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [techNews]);

  // --- SAĞ TARAF (BLOG) OTOMATİK KAYDIRMA (3 SANİYE) ---
  useEffect(() => {
    let interval;
    if (!isPaused && !showModal) {
      interval = setInterval(() => {
        setPostIndex((prev) => (prev + 1) % myPosts.length);
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [isPaused, showModal]); 

  // Manuel Kontrol
  const handleNextNews = () => setNewsIndex((prev) => (prev + 1) % techNews.length);
  const handlePrevNews = () => setNewsIndex((prev) => (prev - 1 + techNews.length) % techNews.length);
  const handleNextPost = () => setPostIndex((prev) => (prev + 1) % myPosts.length);
  const handlePrevPost = () => setPostIndex((prev) => (prev - 1 + myPosts.length) % myPosts.length);

  // Modal
  const openPost = (post) => { setSelectedPost(post); setShowModal(true); setIsPaused(true); };
  const closeModal = () => { setShowModal(false); setIsPaused(false); };

  const currentNews = techNews[newsIndex] || fallbackNews[0];

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Teknoloji <strong className="purple">Gündemi </strong> & <strong className="purple">Blog</strong>
        </h1>
        <p style={{ color: "white" }}>
          Dünyadan teknoloji haberleri (ENG) ve kişisel notlarım.
        </p>

        <Row style={{ marginTop: "50px" }}>
          
          {/* --- SOL TARAF: GLOBAL HABERLER --- */}
          <Col md={6} className="mb-5">
            <h3 style={{ color: "white", textAlign: "left" }}><BiNews /> Global Tech News (ENG)</h3>
            <Card className="project-card-view" style={{ minHeight: "500px", position: "relative" }}>
              <Card.Img 
                variant="top" 
                src={currentNews.urlToImage} 
                alt="news" 
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/500x250?text=News"; }}
                style={{ height: "250px", objectFit: "cover", opacity: 0.9 }} 
              />
              <Card.Body style={{ textAlign: "left" }}>
                <Card.Title style={{ color: "#c770f0", fontWeight: "bold", fontSize: "1.1em" }}>
                    {currentNews.title}
                </Card.Title>
                <Card.Text style={{ color: "white", fontSize: "0.9em" }}>
                  {currentNews.description ? currentNews.description.substring(0, 100) + "..." : "Read more..."}
                </Card.Text>
                <Button variant="primary" href={currentNews.url} target="_blank" size="sm" style={{ marginTop: "10px" }}>
                   Read More &rarr;
                </Button>
                <div style={{ marginTop: "15px", color: "gray", fontSize: "0.8em" }}>
                    Source: {currentNews.source?.name}
                </div>
              </Card.Body>
              <div style={{ position: "absolute", top: "50%", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 10px", transform: "translateY(-50%)" }}>
                  <Button variant="dark" onClick={handlePrevNews} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowLeft /> </Button>
                  <Button variant="dark" onClick={handleNextNews} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowRight /> </Button>
              </div>
            </Card>
          </Col>

          {/* --- SAĞ TARAF: KİŞİSEL BLOG --- */}
          <Col md={6} className="mb-5">
            <h3 style={{ color: "white", textAlign: "left" }}><BsPencilSquare /> Ümitcan'dan Notlar</h3>
            <Card 
                className="project-card-view" 
                style={{ minHeight: "500px", position: "relative", cursor: "pointer", border: "2px solid #c770f0" }}
                onClick={() => openPost(myPosts[postIndex])} 
                onMouseEnter={() => setIsPaused(true)} 
                onMouseLeave={() => setIsPaused(false)} 
            >
              {/* RESİMLERİN KESİLMEMESİ İÇİN contain AYARI */}
              <Card.Img 
                variant="top" 
                src={myPosts[postIndex].image} 
                alt="blog" 
                style={{ 
                    height: "280px", 
                    objectFit: "contain", // Resim kırpılmaz, sığdırılır
                    backgroundColor: "#000",
                    padding: "5px"
                }}
              />
              <Card.Body style={{ textAlign: "left" }}>
                 <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", padding: "5px 10px", borderRadius: "10px", color: "#fff", fontSize:"0.8em" }}>
                    Tam Ekran ⤢
                 </div>
                <Card.Title style={{ color: "#c770f0", fontWeight: "bold" }}>
                    {myPosts[postIndex].title}
                </Card.Title>
                <Card.Text style={{ color: "white" }}>
                  {myPosts[postIndex].content.substring(0, 100)}...
                </Card.Text>
                 <div style={{ marginTop: "10px", color: "gray", fontSize: "0.8em" }}>
                    {myPosts[postIndex].date}
                </div>
                {/* Sayfa Göstergesi */}
                <div style={{ position: "absolute", bottom: "10px", right: "10px", color: "gray", fontSize: "0.8em" }}>
                    {postIndex + 1} / {myPosts.length}
                </div>
              </Card.Body>

               <div style={{ position: "absolute", top: "50%", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 10px", transform: "translateY(-50%)" }}>
                  <Button variant="dark" onClick={(e) => {e.stopPropagation(); handlePrevPost();}} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowLeft /> </Button>
                  <Button variant="dark" onClick={(e) => {e.stopPropagation(); handleNextPost();}} style={{ opacity: 0.7, borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}> <AiOutlineArrowRight /> </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* --- MODAL --- */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered style={{ color: "black" }}>
        <Modal.Header style={{ backgroundColor: "#1c1c1c", borderBottom: "1px solid #c770f0" }}>
          <Modal.Title style={{ color: "#c770f0" }}>{selectedPost?.title}</Modal.Title>
          <Button variant="link" onClick={closeModal} style={{ color: "white", textDecoration: "none" }}><AiOutlineClose size={25}/></Button>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#171717", color: "white", minHeight: "400px" }}>
           <img src={selectedPost?.image} alt="Post" style={{ width: "100%", maxHeight: "400px", objectFit: "contain", backgroundColor: "#000", borderRadius: "10px", marginBottom: "20px" }} />
           <p style={{ fontSize: "1.1em", lineHeight: "1.6", textAlign: "justify" }}>{selectedPost?.content}</p>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Blog;