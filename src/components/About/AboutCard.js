import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Herkese Merhaba, ben <span className="purple">Ümitcan Çinar</span>.
            <br />
            Şu anda <span className="purple">Yazılım Mühendisliği</span> öğrencisiyim.
            <br />
            Yazılım dünyasında modern teknolojiler ve yenilikçi çözümler üzerine odaklanmış durumdayım.
            <br />
            <br />
            Kodlamanın dışında, beni yaratıcı ve zinde tutan şu aktiviteleri yapmaktan keyif alırım:
          </p>

          <ul>
            <li className="about-activity">
              <ImPointRight /> Oyun Oynamak 🎮
            </li>
            <li className="about-activity">
              <ImPointRight /> Teknoloji Blogları Yazmak ✍️
            </li>
            <li className="about-activity">
              <ImPointRight /> Seyahat Etmek ve Yeni Yerler Keşfetmek 🌍
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Fark yaratan şeyler inşa etmek için çabala!"{" "}
          </p>
          <footer className="blockquote-footer">Ümitcan</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;