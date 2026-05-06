import React, { useState, useEffect, lazy, Suspense, memo } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import SEO from "./utils/SEO";
import { analyzeBundle } from "./utils/performance";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// ════════════════════════════════════════════════════════════════
// PERFORMANCE: Code Splitting — React.lazy ile dinamik import
// Her sayfa ayrı bundle olarak yüklenir, sadece ihtiyaç anında.
// ════════════════════════════════════════════════════════════════
const Home = lazy(() => import("./components/Home/Home"));
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Footer = lazy(() => import("./components/Footer"));
const Resume = lazy(() => import("./components/Resume/ResumeNew"));
const Blog = lazy(() => import("./components/Blog/Blog"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const ContactFloating = lazy(() => import("./components/ContactFloating"));
const AdminLogin = lazy(() => import("./components/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
const BlogDetail = lazy(() => import("./components/Blog/BlogDetail"));

// ════════════════════════════════════════════════════════════════
// PERFORMANCE: Suspense fallback — yüklenirken gösterilecek içerik
// ════════════════════════════════════════════════════════════════
function LazyLoadFallback() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      color: "#64748b",
    }}>
      <div style={{ textAlign: "center" }}>
        <div className="loading-spinner" style={{
          width: 40, height: 40, border: "3px solid rgba(139,63,217,0.2)",
          borderTopColor: "#8b3fd9", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 1rem",
        }} />
        <p style={{ fontSize: "0.9rem" }}>Yükleniyor...</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PERFORMANCE: memo ile gereksiz render'ları engelle
// ════════════════════════════════════════════════════════════════
const MemoizedNavbar = memo(Navbar);
const MemoizedScrollToTop = memo(ScrollToTop);
// Footer ve ContactFloating zaten yukarıda lazy olarak tanımlandı

// ════════════════════════════════════════════════════════════════
// Auth Gerektiren Rotalar için Guard
// ════════════════════════════════════════════════════════════════
function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Preloader load={true} />;
  }

  return currentUser ? children : <Navigate to="/login" />;
}

// ════════════════════════════════════════════════════════════════
// PERFORMANCE: useMemo ile route yapılandırmasını önbelleğe al
// ════════════════════════════════════════════════════════════════
function AppContent() {
  const location = useLocation();

  const routes = React.useMemo(() => (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><SEO title="Umitcan Cinar | Ana Sayfa" description="Ümitcan Çinar - Kişisel Yazılım Portfolyosu. React, Node.js, Java ile modern web uygulamaları geliştiriyorum." url="/" /><Home /></PageTransition>} />
      <Route path="/project" element={<PageTransition><SEO title="Projeler | Umitcan Cinar" description="Ümitcan Çinar'ın geliştirdiği yazılım projeleri - Web, mobil ve backend uygulamaları." url="/project" /><Projects /></PageTransition>} />
      <Route path="/about" element={<PageTransition><SEO title="Hakkımda | Umitcan Cinar" description="Ümitcan Çinar - Yazılım Mühendisi. Teknoloji tutkusu, deneyim ve özgeçmiş bilgileri." url="/about" /><About /></PageTransition>} />
      <Route path="/resume" element={<PageTransition><SEO title="Özgeçmiş | Umitcan Cinar" description="Ümitcan Çinar - Profesyonel özgeçmiş, deneyimler, eğitim ve sertifikalar." url="/resume" /><Resume /></PageTransition>} />
      <Route path="/blog" element={<PageTransition><SEO title="Blog | Umitcan Cinar" description="Ümitcan Çinar'ın yazılım, teknoloji ve kişisel gelişim üzerine blog yazıları." url="/blog" /><Blog /></PageTransition>} />
      <Route path="/blog/:slug" element={<PageTransition><SEO title="Blog | Umitcan Cinar" description="Blog yazısı detay sayfası." url="/blog" /><BlogDetail /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><SEO title="İletişim | Umitcan Cinar" description="Ümitcan Çinar ile iletişime geçin. Projeleriniz için benimle çalışmak ister misiniz?" url="/contact" /><Contact /></PageTransition>} />
      <Route path="/login" element={<PageTransition><SEO title="Giriş | Umitcan Cinar" description="Admin paneli giriş sayfası." url="/login" /><AdminLogin /></PageTransition>} />
      <Route path="/admin" element={<RequireAuth><SEO title="Admin Paneli | Umitcan Cinar" description="Portfolyo yönetim paneli." url="/admin" /><AdminDashboard /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  ), [location]);

  return (
    <>
      <Suspense fallback={<LazyLoadFallback />}>
        <MemoizedNavbar />
        <MemoizedScrollToTop />
        <AnimatePresence mode="wait">
          {routes}
        </AnimatePresence>
        <Footer />
      </Suspense>
    </>
  );
}

function App() {
  const [load, upadateLoad] = useState(true);

  // --- PRELOADER ZAMANLAYICISI ---
  // Sayfa açılınca 1.2 saniye bekler, sonra yükleme ekranını kaldırır.
  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Performance analizi (sadece devtools'ta)
  useEffect(() => {
    analyzeBundle();
  }, []);

  return (
    <Router>
      <AuthProvider>
        {/* Yükleme Ekranı Bileşeni */}
        <Preloader load={load} />

        <div className="App" id={load ? "no-scroll" : "scroll"}>

          {/* Sağ Alttaki WhatsApp/Mail Butonu — lazy loaded */}
          <Suspense fallback={null}>
            <ContactFloating />
          </Suspense>

          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;