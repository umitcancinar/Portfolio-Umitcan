# 🍎 Apple Design Portfolio - Backend

Apple tasarım temalı portfolyo sitesi için backend API. Admin paneli ve site güncellemeleri için tüm API'leri sağlar.

## 📋 Teknolojiler

- **Node.js** + **Express.js** - Sunucu framework
- **SQLite** (better-sqlite3) - Veritabanı
- **JWT** (jsonwebtoken) - Authentication
- **bcrypt** - Şifreleme
- **multer** - Dosya yükleme
- **helmet** - HTTP güvenliği
- **cors** - Cross-origin yönetimi
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validasyonu
- **morgan** - Logging

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd backend
npm install
```

### 2. Environment Variables

`.env` dosyası zaten proje ile birlikte gelir. Production ortamında aşağıdaki değerleri değiştirmeyi unutmayın:

| Değişken | Açıklama |
|---|---|
| `JWT_SECRET` | JWT token imzalama anahtarı |
| `REFRESH_TOKEN_SECRET` | Refresh token imzalama anahtarı |
| `MASTER_KEY` | Admin kaydı için master key |
| `API_KEY` | Sunucu-sunucu iletişimi için API key |
| `FRONTEND_URL` | Frontend URL'si (CORS için) |

### 3. Seed Verisi

```bash
npm run seed
```

Bu komut ile:
- Admin kullanıcı oluşturulur (`admin` / `admin123`)
- 4 site bölümü (hero, about, skills, contact)
- 5 örnek proje
- 3 referans
- 9 chatbot yanıtı eklenir.

### 4. Sunucuyu Başlat

```bash
npm start
```

Sunucu `http://localhost:3001` adresinde çalışacaktır.

## 📡 API Endpoints

### Auth
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Admin kaydı (master key ile) | - |
| POST | `/api/auth/login` | Giriş (JWT döner) | - |
| POST | `/api/auth/verify` | Token doğrulama | JWT |
| POST | `/api/auth/change-password` | Şifre değiştir | JWT |
| POST | `/api/auth/refresh` | Refresh token | - |

### Content
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| GET | `/api/content` | Tüm bölümleri getir | - |
| GET | `/api/content/:section` | Bölüm içeriğini getir | - |
| PUT | `/api/content/:section` | Bölüm içeriğini güncelle | JWT |

### Projects
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| GET | `/api/projects` | Tüm projeler | - |
| GET | `/api/projects/:id` | Tek proje | - |
| POST | `/api/projects` | Proje ekle | JWT (admin) |
| PUT | `/api/projects/:id` | Proje güncelle | JWT (admin) |
| DELETE | `/api/projects/:id` | Proje sil | JWT (admin) |
| POST | `/api/projects/reorder` | Proje sırası | JWT (admin) |

### Messages
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/messages` | Ziyaretçi mesaj gönder | Rate limited |
| GET | `/api/messages` | Mesajları listele | JWT (admin) |
| PUT | `/api/messages/:id/read` | Mesajı okundu işaretle | JWT (admin) |
| DELETE | `/api/messages/:id` | Mesaj sil | JWT (admin) |

### References
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| GET | `/api/references` | Tüm referanslar | - |
| POST | `/api/references` | Referans ekle | JWT (admin) |
| PUT | `/api/references/:id` | Referans güncelle | JWT (admin) |
| DELETE | `/api/references/:id` | Referans sil | JWT (admin) |

### Upload
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/upload/project-image` | Proje görseli yükle | JWT (admin) |
| POST | `/api/upload/cv` | CV yükle | JWT (admin) |
| POST | `/api/upload/reference-logo` | Referans logosu yükle | JWT (admin) |
| GET | `/api/upload/cv/latest` | En son CV'yi getir | - |

### Chatbot
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| GET | `/api/chatbot/responses` | Tüm chatbot yanıtları | JWT (admin) |
| POST | `/api/chatbot/responses` | Yanıt ekle | JWT (admin) |
| PUT | `/api/chatbot/responses/:id` | Yanıt güncelle | JWT (admin) |
| DELETE | `/api/chatbot/responses/:id` | Yanıt sil | JWT (admin) |
| POST | `/api/chatbot/query` | Chatbot sorgula | Rate limited |

### Game
| Metot | Endpoint | Açıklama | Auth |
|---|---|---|---|
| GET | `/api/game/scores` | En yüksek skorlar | - |
| POST | `/api/game/scores` | Skor kaydet | - |
| DELETE | `/api/game/scores/:id` | Skor sil | JWT (admin) |

### Health
| Metot | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/health` | Sunucu sağlık kontrolü |

## 🔒 Güvenlik Önlemleri

- Tüm şifreler bcrypt ile hash'lenir (12 salt round)
- JWT token'lar 24 saat geçerli, refresh token mekanizması
- Helmet ile HTTP header güvenliği
- Rate limiting (100 req/15dk genel, 10 req/15dk auth)
- CORS sadece izinli domain'lere açık
- Input validasyonu ve sanitizasyon
- SQL injection koruması (parameterized queries)
- XSS koruması
- Dosya yükleme limiti (max 5MB)

## 📁 Proje Yapısı

```
backend/
├── config/
│   ├── database.js      # SQLite veritabanı bağlantısı
│   └── seed.js          # Seed verisi
├── controllers/
│   ├── authController.js
│   ├── contentController.js
│   ├── projectController.js
│   ├── messageController.js
│   ├── referenceController.js
│   ├── uploadController.js
│   ├── chatbotController.js
│   └── gameController.js
├── middleware/
│   ├── auth.js          # JWT & API Key auth
│   ├── rateLimiter.js   # Rate limiting
│   ├── upload.js        # Dosya yükleme
│   └── errorHandler.js  # Hata yönetimi
├── routes/
│   ├── auth.js
│   ├── content.js
│   ├── projects.js
│   ├── messages.js
│   ├── references.js
│   ├── upload.js
│   ├── chatbot.js
│   └── game.js
├── uploads/
│   ├── projects/        # Proje görselleri
│   ├── references/      # Referans logoları
│   └── cv/              # CV dosyaları
├── data/                # SQLite veritabanı
├── .env                 # Environment variables
├── package.json
├── server.js            # Ana sunucu dosyası
└── README.md
```
