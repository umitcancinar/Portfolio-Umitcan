# 🍎 Apple Design Portfolio

> Dünyanın en iyi kişisel portfolyo sitesi — Apple tasarım dilinde, ultra güvenli, çok fonksiyonlu.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![Apple Design](https://img.shields.io/badge/Design-Apple%20Inspired-0071E3)
![Security](https://img.shields.io/badge/Security-Ultra%20High-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## ✨ Özellikler

### 🎨 Ana Site
- **Apple Tasarım Dili** — SF Pro font sistemi, #0071E3 aksan, bol whitespace
- **Dark/Light Mode** — Sistem tercihi + localStorage ile kalıcı tema
- **Premium Animasyonlar** — Scroll fade-in, parallax, typing effect, gradient text
- **Custom Cursor** — Minimal daire imleç, mouse tracking
- **Loading Screen** — İlk yüklenişte şık animasyon
- **Scroll Progress Bar** — Sayfanın tepesinde ilerleme çubuğu
- **Responsive** — 320px'den 1920px'e kadar kusursuz uyum

### 📋 Admin Panel (`/admin`)
| Modül | Açıklama |
|-------|----------|
| 🔐 **Login** | JWT ile güvenli giriş |
| 📊 **Dashboard** | İstatistikler, son mesajlar |
| 📝 **Content** | Hero, About, Skills içerik yönetimi |
| 📁 **Projects** | Proje ekle/sil/düzenle/sırala |
| 🌟 **References** | Referans yönetimi |
| 💬 **Messages** | Gelen kutusu, okundu/okunmamış |
| 📄 **CV** | PDF yükleme/görüntüleme |
| 🤖 **Chatbot** | Yanıtları düzenleme |
| 🎮 **Game** | Skor tablosu yönetimi |
| 🔒 **Security** | Şifre değiştirme, oturum |

### 🤖 Akıllı Chatbot
- Apple Messages tarzı arayüz
- 10+ farklı senaryoya yanıt
- Backend API entegrasyonu
- Yazıyor animasyonu, hızlı yanıt butonları

### 🎮 Memory Card Game
- 4x4 hafıza kartı (8 çift)
- CSS 3D flip animasyonu
- Kronometre + puan sistemi
- Leaderboard (backend + localStorage)
- Konfeti efekti

### 🛡️ Güvenlik
- **JWT** — 24 saat geçerli token + refresh
- **bcrypt** — Şifre hashleme
- **helmet** — HTTP header güvenliği
- **Rate Limiting** — 100 req/15dk
- **CORS** — Sadece izinli domain'ler
- **SQL Injection** — Parameterized queries
- **XSS** — Input sanitizasyonu
- **API Key** — Sunucu-sunucu iletişimi

---

## 🏗️ Proje Yapısı

```
/
├── index.html              # Ana portfolyo sayfası
├── style.css               # Apple tasarım stilleri
├── script.js               # Frontend etkileşimleri
├── admin/                  # Admin paneli
│   ├── index.html          # Dashboard
│   ├── login.html          # Giriş ekranı
│   ├── css/admin.css       # Admin stilleri
│   └── js/admin.js         # Admin JS
├── backend/                # Node.js API
│   ├── server.js           # Express sunucu
│   ├── config/             # DB + seed
│   ├── controllers/        # 8 controller
│   ├── middleware/          # JWT, rate-limiter, upload
│   ├── routes/             # 8 API rotası
│   └── uploads/            # Dosya deposu
├── chatbot/                # Chatbot modülü
├── game/                   # Memory Card oyunu
└── .gitignore
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL (Neon.tech veya local)

### 1. Backend Kurulumu

```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenle (DATABASE_URL, JWT_SECRET vb.)
npm start
```

### 2. Frontend
```bash
# index.html'i tarayıcıda aç veya bir HTTP sunucu ile serve et:
npx serve .
```

### 3. Admin Paneli
```bash
# Tarayıcıda aç:
open admin/login.html
# Varsayılan: admin@example.com / sifre
```

---

## ⚙️ Environment Variables

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `PORT` | Sunucu portu | `3001` |
| `DATABASE_URL` | PostgreSQL bağlantısı | — |
| `JWT_SECRET` | JWT imza anahtarı | — |
| `MASTER_KEY` | İlk admin kaydı için | — |
| `FRONTEND_URL` | CORS izinli domain | `http://localhost:3000` |

---

## 🔗 API Endpoints

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/auth/login` | Admin giriş |
| POST | `/api/auth/register` | Admin kayıt |
| GET | `/api/content` | Tüm içerik |
| GET | `/api/projects` | Tüm projeler |
| POST | `/api/projects` | Proje ekle |
| GET | `/api/messages` | Mesajlar |
| POST | `/api/messages` | Mesaj gönder |
| GET | `/api/references` | Referanslar |
| POST | `/api/chatbot/query` | Chatbot sorgula |
| GET | `/api/game/scores` | Skor tablosu |
| POST | `/api/upload/cv` | CV yükle |

---

## 🧪 Test

```bash
# Backend test
cd backend && npm test

# Tarayıcı testi
# Chrome DevTools Lighthouse ile:
# Performance: 95+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 100
```

---

## 🎨 Tasarım Felsefesi

Bu portfolyo, Apple'ın tasarım prensiplerini temel alır:

> **"Design is not just what it looks like and feels like. Design is how it works."** — Steve Jobs

- **Minimalizm** — Gereksiz hiçbir şey yok
- **Hiyerarşi** — Tipografi ile görsel hiyerarşi
- **Tutarlılık** — Her piksel aynı dili konuşur
- **Erişilebilirlik** — ARIA etiketleri, semantic HTML
- **Performans** — Lighthouse 95+

---

## 📸 Ekran Görüntüleri

> _Yakında eklenecek_

---

## 🤝 Katkıda Bulunma

1. Fork et
2. Feature branch oluştur (`git checkout -b feature/yeni-ozellik`)
3. Değişiklikleri commit et (`git commit -m 'feat: yeni özellik eklendi'`)
4. Branch'i push et (`git push origin feature/yeni-ozellik`)
5. Pull Request aç

---

## 📄 Lisans

MIT License — Kullanabilir, değiştirebilir, paylaşabilirsiniz.

---

## 👨‍💻 Geliştirici

**İsim Soyisim** — [Portfolyo](https://github.com/umitcancinar) | [LinkedIn](https://linkedin.com)

---

> 🍎 **Apple kalitesinde, ultra güvenli, çok fonksiyonlu — dünyanın en iyi portfolyo sitesi.**
