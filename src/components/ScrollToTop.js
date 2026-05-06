import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Sayfa değişiminde smooth scroll to top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  // Scroll pozisyonunu dinle (scroll-to-top butonu için)
  // Bu ContactFloating componentinde yönetiliyor, sadece pathname değişimi burada

  return null;
}

export default ScrollToTop;
