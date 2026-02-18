import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import Blog from "./components/Blog/Blog";
import ContactFloating from "./components/ContactFloating"; // Yeni Ekledik
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
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

          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;