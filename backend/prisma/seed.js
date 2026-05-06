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

  // ── Sample Blog Post ──
  const blog = await prisma.blogPost.upsert({
    where: { slug: "welcome-to-my-blog" },
    update: {},
    create: {
      title: "Welcome to My Blog",
      slug: "welcome-to-my-blog",
      excerpt:
        "Welcome to my personal blog where I share my thoughts on web development, technology, and more.",
      content: `# Welcome to My Blog\n\nThis is my first blog post. I'll be sharing my experiences, tutorials, and thoughts about web development.\n\n## What to Expect\n\n- **Web Development Tutorials**: React, Node.js, and more\n- **Project Showcases**: Details about my projects\n- **Tech Insights**: My thoughts on the latest technologies\n\nStay tuned for more content!`,
      tags: ["welcome", "introduction", "web-development"],
      published: true,
      readTime: 3,
      authorId: admin.id,
    },
  });

  console.log(`✅ Sample blog post created: ${blog.title}`);

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
