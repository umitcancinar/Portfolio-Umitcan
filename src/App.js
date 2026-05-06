import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import Blog from "./components/Blog/Blog";
import BlogDetail from "./components/Blog/BlogDetail";
import Contact from "./components/Contact/Contact";
import ContactFloating from "./components/ContactFloating";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
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
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Preloader load={true} />;
  }

  return currentUser ? children : <Navigate to="/login" />;
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/project" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/resume" element={<PageTransition><Resume /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogDetail /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/login" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin" element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
      <Footer />
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

  return (
    <Router>
      <AuthProvider>
        {/* Yükleme Ekranı Bileşeni */}
        <Preloader load={load} />

        <div className="App" id={load ? "no-scroll" : "scroll"}>

          {/* Sağ Alttaki WhatsApp/Mail Butonu */}
          <ContactFloating />

          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;