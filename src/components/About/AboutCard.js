import React from "react";
import Card from "react-bootstrap/Card";
import { motion } from "framer-motion";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <motion.p
            style={{ textAlign: "justify" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Herkese Merhaba, ben <span className="purple">Ümitcan Çinar</span>.
            <br />
            Şu anda <span className="purple">Yazılım Mühendisliği</span> öğrencisiyim.
            <br />
            Yazılım dünyasında modern teknolojiler ve yenilikçi çözümler üzerine odaklanmış durumdayım.
            <br />
            <br />
            Kodlamanın dışında, beni yaratıcı ve zinde tutan şu aktiviteleri yapmaktan keyif alırım:
          </motion.p>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.2 },
              },
            }}
          >
            {[
              { icon: "🎮", text: "Oyun Oynamak" },
              { icon: "✍️", text: "Teknoloji Blogları Yazmak" },
              { icon: "🌍", text: "Seyahat Etmek ve Yeni Yerler Keşfetmek" },
            ].map((item, i) => (
              <motion.li
                key={i}
                className="about-activity"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <ImPointRight /> {item.icon} {item.text}
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            style={{ color: "rgb(155 126 172)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            "Fark yaratan şeyler inşa etmek için çabala!"{" "}
          </motion.p>
          <motion.footer
            className="blockquote-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Ümitcan
          </motion.footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;