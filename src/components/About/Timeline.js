import React from "react";
import { motion } from "framer-motion";
import useScrollReveal from "../../hooks/useScrollReveal";

/* ─── Experience Data ─── */
const experiences = [
  {
    title: "Frontend Developer",
    company: "Freelance",
    period: "2024 - Devam Ediyor",
    description: [
      "Modern web uygulamaları geliştirme (React, Next.js)",
      "Responsive ve kullanıcı dostu arayüz tasarımı",
      "RESTful API entegrasyonu ve performans optimizasyonu",
    ],
  },
  {
    title: "Yazılım Mühendisliği Öğrencisi",
    company: "Üniversite",
    period: "2023 - Devam Ediyor",
    description: [
      "Nesne Yönelimli Programlama ve Veri Yapıları",
      "Web Teknolojileri ve Veritabanı Yönetimi",
      "Açık kaynak projelere katkı ve ekip çalışması",
    ],
  },
  {
    title: "Stajyer Yazılım Geliştirici",
    company: "Teknoloji Şirketi",
    period: "2024 (3 Ay)",
    description: [
      "Java Spring Boot ile backend geliştirme",
      "Mikroservis mimarisi ve API tasarımı",
      "Code review ve test süreçlerine katılım",
    ],
  },
];

/* ─── Stagger Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

/* ─── Single Timeline Item ─── */
function TimelineItem({ experience, index }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="timeline-item"
      variants={itemVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Timeline dot */}
      <motion.div
        className="timeline-dot"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content card */}
      <div className="timeline-content glass-card">
        <div className="timeline-header">
          <motion.span
            className="timeline-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            {experience.period}
          </motion.span>
        </div>
        <h3 className="timeline-title">{experience.title}</h3>
        <h4 className="timeline-company">{experience.company}</h4>
        <ul className="timeline-description">
          {experience.description.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 100 }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ─── Timeline Component ─── */
function Timeline() {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.05 });

  return (
    <motion.div
      ref={sectionRef}
      className="timeline-section"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        Deneyim <strong className="purple">Zaman Çizelgesi</strong>
      </h1>

      <div className="timeline-container">
        {experiences.map((exp, index) => (
          <TimelineItem key={index} experience={exp} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

export default Timeline;
