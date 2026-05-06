const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin User ──
  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@umitcancinar.me" },
    update: {},
    create: {
      email: "admin@umitcancinar.me",
      username: "admin",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // ── Site Settings ──
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Ümit Can Çınar",
      siteDescription: "Personal Portfolio & Blog",
      heroTitle: "Hello, I'm Ümit Can",
      heroSubtitle: "Full Stack Developer",
      aboutText:
        "I'm a passionate full-stack developer with experience in building modern web applications. I love working with React, Node.js, and exploring new technologies.",
      email: "umit@example.com",
      location: "Istanbul, Turkey",
      socialLinks: [
        { platform: "github", url: "https://github.com/umitcancinar" },
        { platform: "linkedin", url: "https://linkedin.com/in/umitcancinar" },
      ],
      skills: [
        { name: "React", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 75 },
        { name: "PostgreSQL", level: 70 },
      ],
      metaTitle: "Ümit Can Çınar - Portfolio",
      metaDescription:
        "Full Stack Developer portfolio showcasing projects and blog posts.",
    },
  });

  console.log(`✅ Site settings created`);

  // ── Sample Project ──
  const project = await prisma.project.upsert({
    where: { slug: "portfolio-website" },
    update: {},
    create: {
      title: "Portfolio Website",
      slug: "portfolio-website",
      description:
        "Personal portfolio website built with React and Node.js",
      content:
        "This is my personal portfolio website built with React, featuring a modern design, blog section, and contact form. The backend is powered by Express and PostgreSQL.",
      imageUrl: "/images/portfolio.png",
      githubUrl: "https://github.com/umitcancinar/portfolio",
      liveUrl: "https://umitcancinar.me",
      technologies: ["React", "Node.js", "PostgreSQL", "Prisma"],
      featured: true,
      order: 1,
      published: true,
      authorId: admin.id,
    },
  });

  console.log(`✅ Sample project created: ${project.title}`);

  // ── Blog Posts ──
  const blogPosts = [
    {
      title: "TBM Akran Eğitimi Sunumu",
      slug: "tbm-akran-egitimi-sunumu",
      excerpt: "Değerli eğitmenlerden değerli eğitimler alarak sonuca erdirdiğimiz bu kamp maceramızın son gününde sınav ve sunum yaptık.",
      content: `# TBM Akran Eğitimi Sunumu

Değerli eğitmenlerden değerli eğitimler alarak sonuca erdirdiğimiz bu kamp maceramızın son gününde sınav ve sunum yaptık. Sunumumuz çok beğenildi :)

## Süreç

- Yoğun bir eğitim dönemi geçirdik
- Sınav ve sunum aşamalarını başarıyla tamamladık
- Akran eğitimi kapsamında önemli deneyimler kazandık`,
      tags: ["egitim", "tbm", "akran-egitimi", "sertifika"],
      category: "egitim",
      published: true,
      readTime: 3,
      coverImage: "/Assets/blog1.png",
    },
    {
      title: "Belge Töreni",
      slug: "belge-toreni",
      excerpt: "Eğitimler ve sınavlar sonucu bu değerli belgeyi almaya hak kazandım.",
      content: `# Belge Töreni

Eğitimler ve sınavlar sonucu bu değerli belgeyi almaya hak kazandım.

## Hatıralar

Bu süreçte edindiğim bilgi ve deneyimler benim için çok değerli. Tüm eğitmenlerimize teşekkür ederim.

Belge töreni, tüm katılımcılar için unutulmaz bir anı oldu.`,
      tags: ["belge", "toren", "sertifika", "egitim"],
      category: "egitim",
      published: true,
      readTime: 2,
      coverImage: "/Assets/blog2.png",
    },
    {
      title: "Online Kod Editörüm Yayında!",
      slug: "online-kod-editorum-yayinda",
      excerpt: "Uzun zamandır üzerinde çalıştığım API ile çalışan online kod editörüm KODASISTANIM yayında.",
      content: `# Online Kod Editörüm Yayında!

Uzun zamandır üzerinde çalıştığım API ile çalışan online kod editörüm **KODASISTANIM** yayında. Hemen deneyin!

## Özellikler

- Çoklu dil desteği
- API ile çalışan altyapı
- Kullanıcı dostu arayüz
- Hızlı kod çalıştırma

Bu proje ile yazılım geliştirme sürecinde önemli bir adım attım.`,
      tags: ["kod-editoru", "online", "api", "yazilim", "proje"],
      category: "yazilim",
      published: true,
      readTime: 4,
      coverImage: "/Assets/blog3.png",
    },
    {
      title: "Dostlarla Haklı Gurur",
      slug: "dostlarla-hakli-gurur",
      excerpt: "Zorlu sürecin sonunda sertifikalarımızı aldık. Haklı gurur.",
      content: `# Dostlarla Haklı Gurur

Zorlu sürecin sonunda sertifikalarımızı aldık. Haklı gurur.

## Birlikte Başardık

Bu zorlu maratonu dostlarımızla birlikte tamamlamanın mutluluğunu yaşıyoruz. Her birimiz bu süreçte çok şey öğrendik ve büyüdük.

Sertifikalarımızı alırken çekilen bu fotoğraf, bu güzel günlerin hatırası olarak kalacak.`,
      tags: ["sertifika", "dostluk", "basari", "egitim"],
      category: "egitim",
      published: true,
      readTime: 2,
      coverImage: "/Assets/blog4.png",
    },
    {
      title: "Dostlarla Toplu Fotoğraf :)",
      slug: "dostlarla-toplu-fotograf",
      excerpt: "Hepsi birbirinden kıymetli dostlara selam olsun!",
      content: `# Dostlarla Toplu Fotoğraf :)

Hepsi birbirinden kıymetli dostlara selam olsun!

## Anılar

Bu güzel insanlarla birlikte olmak, aynı hedefler için çalışmak ve başarmak tarif edilemez bir duygu.

Her birinize ayrı ayrı teşekkür ederim. Bu yolculukta sizlerle birlikte olmak büyük bir şans.`,
      tags: ["dostluk", "fotograf", "ani", "egitim"],
      category: "genel",
      published: true,
      readTime: 2,
      coverImage: "/Assets/blog5.png",
    },
    {
      title: "Portfolio Web Sitem Yayında",
      slug: "portfolio-web-sitem-yayinda",
      excerpt: "React ile geliştirdiğim kişisel portfolio web sitem artık canlı! Modern tasarım ve ileri seviye özellikler.",
      content: `# Portfolio Web Sitem Yayında

React ile geliştirdiğim kişisel portfolio web sitem artık canlı! Modern tasarım ve ileri seviye özellikler.

## Teknolojiler

- **React 18** ile modern UI
- **Framer Motion** ile akıcı animasyonlar
- **Node.js + Express** backend
- **PostgreSQL** veritabanı
- **Prisma** ORM

## Özellikler

- Responsive tasarım
- Dark tema
- Admin panel
- Blog yönetimi
- İletişim formu`,
      tags: ["portfolio", "react", "nodejs", "web", "yayin"],
      category: "yazilim",
      published: true,
      readTime: 5,
      coverImage: "",
    },
  ];

  for (const postData of blogPosts) {
    const blog = await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        ...postData,
        authorId: admin.id,
      },
    });
    console.log(`✅ Blog post created: ${blog.title}`);
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
