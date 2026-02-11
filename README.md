# 👨‍💻 Ümitcan Çınar | Yazılım Mühendisi - Kişisel Portfolyo

[![Website Status](https://img.shields.io/website?down_color=red&down_message=Offline&label=Canl%C4%B1%20Site&style=flat-square&up_color=success&up_message=Online&url=https%3A%2F%2Fwww.umitcancinar.me)](https://www.umitcancinar.me)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ba%C4%9Flant%C4%B1%20Kur-blue?style=flat-square&logo=linkedin)](YOUR_LINKEDIN_URL_HERE)
[![Email](https://img.shields.io/badge/Email-admin%40umitcancinar.me-555?style=flat-square&logo=gmail)](mailto:admin@umitcancinar.me)

> Modern teknolojilerle geliştirilmiş, ölçeklenebilir ve kullanıcı dostu kişisel portfolyo web sitesi.

---

## 🌐 Proje Mimarisi ve Genel Bakış

Aşağıdaki görsel, projenin altyapısını, domain yönetimini, e-posta entegrasyonunu ve dağıtım (deployment) iş akışını özetlemektedir.

![Ümitcan Çınar Portfolyo Mimarisi ve Dashboard](https://github.com/umitcancinar/Portfolio-Umitcan/blob/main/Images/project-architecture-dashboard.png)
*Projenin DNS, Hosting, E-posta ve CI/CD süreçlerini gösteren altyapı diyagramı.*

## 🚀 Canlı Bağlantılar (Quick Links)

| 🔗 Platform | 👉 Link | 📝 Açıklama |
| :--- | :--- | :--- |
| **Canlı Website** | [**www.umitcancinar.me**](https://www.umitcancinar.me) | Projenin yayındaki son hali. |
| **Güncel CV** | [**PDF İndir**](https://www.umitcancinar.me/Assets/Soumyajit_Behera.pdf) | Tek tıkla güncel özgeçmişim. |
| **Kurumsal Mail** | `admin@umitcancinar.me` | Profesyonel iletişim kanalı. |

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

Bu proje, modern web geliştirme standartlarına uygun olarak aşağıdaki teknolojilerle inşa edilmiştir:

### Frontend (Önyüz)
* ![React](https://img.shields.io/badge/-React.js-61DAFB?style=flat-square&logo=react&logoColor=black) **React.js:** Dinamik ve bileşen tabanlı kullanıcı arayüzü.
* ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) **HTML5 & Semantic UI:** Anlamsal yapı ve modern tasarım öğeleri.
* ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) **CSS3 & Responsive Design:** Tüm cihazlarla uyumlu esnek tasarım.

### Backend & Altyapı (Infrastructure)
* ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) **Node.js & npm:** Paket yönetimi ve geliştirme ortamı.
* ![GitHub Pages](https://img.shields.io/badge/-GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white) **GitHub Pages:** Hızlı ve güvenilir statik site barındırma.
* ![Namecheap](https://img.shields.io/badge/-Namecheap-de3723?style=flat-square&logo=namecheap&logoColor=white) **Namecheap DNS:** Özel domain yönetimi ve SSL yapılandırması.
* ![Gmail](https://img.shields.io/badge/-Email%20Forwarding-D14836?style=flat-square&logo=gmail&logoColor=white) **Email Yönlendirme:** Kurumsal mail altyapısı.

---

## 🔄 İş Akışı ve Dağıtım (Workflow)

Proje, sürekli entegrasyon ve dağıtım (CI/CD) mantığıyla yönetilmektedir:

1.  **Geliştirme (Local Dev):** Kod değişiklikleri yerel ortamda yapılır ve test edilir.
2.  **Dağıtım (Deploy):** `npm run deploy` komutu ile proje derlenir (build alınır).
3.  **Yayınlama (Hosting):** Derlenen dosyalar otomatik olarak GitHub Pages'in `gh-pages` dalına yüklenir.
4.  **DNS & SSL:** Namecheap üzerindeki CNAME kayıtları trafiği GitHub'a yönlendirir ve GitHub tarafından sağlanan SSL sertifikası ile site güvenli (`https://`) olarak yayınlanır.

---

## 💻 Kurulum ve Yerel Çalıştırma

Projeyi kendi bilgisayarınızda incelemek veya geliştirmek için:

1.  **Repoyu Klonlayın:**
    ```bash
    git clone [https://github.com/umitcancinar/Portfolio-Umitcan.git](https://github.com/umitcancinar/Portfolio-Umitcan.git)
    ```
2.  **Dizine Girin ve Bağımlılıkları Yükleyin:**
    ```bash
    cd Portfolio-Umitcan
    npm install
    ```
3.  **Projeyi Başlatın:**
    ```bash
    npm start
    ```
    Tarayıcınızda `http://localhost:3000` adresinde çalışacaktır.

---

## 📬 İletişim

Projelerim hakkında konuşmak veya iş birliği yapmak için çekinmeyin.

* **LinkedIn:** [Profilime Git](YOUR_LINKEDIN_URL_HERE) (Lütfen buraya kendi linkini ekle)
* **GitHub:** [@umitcancinar](https://github.com/umitcancinar)
* **Email:** admin@umitcancinar.me

---
<div align="center">
  ⭐️ <b>Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!</b> ⭐️<br>
  <sub>© 2024 Ümitcan Çınar. Tüm hakları saklıdır.</sub>
</div>