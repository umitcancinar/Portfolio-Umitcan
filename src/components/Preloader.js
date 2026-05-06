import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function Preloader(props) {
  return (
    <AnimatePresence>
      {props.load && (
        <motion.div
          id="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999999,
            background: "#0c0a1a",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* Apple-inspired circular loader */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Spinning outer ring */}
            <motion.svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              style={{ position: "absolute" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b3fd9" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              <circle
                cx="40" cy="40" r="35"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="3"
              />
              <circle
                cx="40" cy="40" r="35"
                fill="none"
                stroke="url(#loaderGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset="40"
                style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
              />
            </motion.svg>

            {/* Inner pulsing dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#8b3fd9",
                boxShadow: "0 0 20px rgba(139, 63, 217, 0.6)",
              }}
            />
          </motion.div>

          {/* Name text with fade in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginTop: "2rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #8b3fd9, #f472b6, #60a5fa)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "2px",
                animation: "gradientText 4s ease infinite",
              }}
            >
              Umitcan Cinar
            </span>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            style={{
              marginTop: "1.5rem",
              width: "160px",
              height: "3px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #8b3fd9, #f472b6)",
                borderRadius: "3px",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
