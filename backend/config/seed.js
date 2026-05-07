const bcrypt = require('bcryptjs');
const { pool, initDatabase } = require('./database');
require('dotenv').config();

async function seed() {
  const client = await pool.connect();
  try {
    await initDatabase();
    console.log('[Seed] Tablolar kontrol edildi. Seed başlıyor...');

    // Default admin user
    const passwordHash = await bcrypt.hash('admin123', 12);
    const userResult = await client.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, username, email`,
      ['admin', 'admin@portfolio.local', passwordHash, 'admin']
    );
    console.log(userResult.rows.length > 0
      ? `[Seed] Admin kullanıcı oluşturuldu: ${userResult.rows[0].email}`
      : '[Seed] Admin kullanıcı zaten mevcut.');

    // Hero
    await client.query(
      `INSERT INTO content (section, data) VALUES ($1, $2) ON CONFLICT (section) DO NOTHING`,
      ['hero', JSON.stringify({ greeting: 'Merhaba, ben', name: 'İsim Soyisim', subtitle: 'Yazılım Geliştirici & Tasarım Tutkunu', description: 'Modern, temiz ve kullanıcı odaklı dijital deneyimler yaratıyorum.' })]
    );

    // About
    await client.query(
      `INSERT INTO content (section, data) VALUES ($1, $2) ON CONFLICT (section) DO NOTHING`,
      ['about', JSON.stringify({ title: 'Hakkımda', subtitle: 'Beni daha yakından tanıyın' })]
    );

    // Skills
    const skillsCategories = [
      {
        icon: '🌐', name: 'Frontend', items: [
          { name: 'HTML / CSS', percent: 95 }, { name: 'JavaScript / TypeScript', percent: 90 }, { name: 'React / Next.js', percent: 85 }
        ]
      },
      {
        icon: '⚙️', name: 'Backend', items: [
          { name: 'Node.js / Express', percent: 85 }, { name: 'Python / Django', percent: 75 }, { name: 'PostgreSQL', percent: 80 }
        ]
      },
      {
        icon: '🛠️', name: 'Araçlar', items: [
          { name: 'Git / GitHub', percent: 90 }, { name: 'Docker', percent: 75 }, { name: 'CI/CD', percent: 80 }
        ]
      },
      {
        icon: '🎨', name: 'Tasarım', items: [
          { name: 'Figma', percent: 85 }, { name: 'UI/UX', percent: 80 }, { name: 'Responsive Design', percent: 95 }
        ]
      }
    ];
    await client.query(
      `INSERT INTO content (section, data) VALUES ($1, $2) ON CONFLICT (section) DO NOTHING`,
      ['skills', JSON.stringify({ title: 'Beceriler', subtitle: 'Teknolojik yetkinliklerim', categories: skillsCategories })]
    );

    // Projects
    const projects = [
      { title: 'E-Ticaret Platformu', desc: 'Modern responsive web uygulaması. PostgreSQL + React.', tags: ['React', 'Node.js', 'PostgreSQL'], cat: 'frontend', ord: 1 },
      { title: 'Mobil Fitness App', desc: 'iOS ve Android için cross-platform uygulama.', tags: ['Flutter', 'Dart', 'Firebase'], cat: 'mobile', ord: 2 },
      { title: 'Mikroservis Backend', desc: 'Yüksek performanslı mikroservis mimarisi.', tags: ['Node.js', 'GraphQL', 'Docker'], cat: 'backend', ord: 3 },
      { title: 'Kurumsal Web Sitesi', desc: 'Kurumsal kimlik ve web sitesi tasarımı.', tags: ['Figma', 'Next.js', 'Framer'], cat: 'frontend', ord: 4 },
      { title: 'Veri Analiz Paneli', desc: 'Gerçek zamanlı veri görselleştirme paneli.', tags: ['Vue.js', 'D3.js', 'WebSocket'], cat: 'frontend', ord: 5 },
      { title: 'Online Ödeme Sistemi', desc: 'Full-stack ödeme entegrasyonu.', tags: ['Angular', 'Strapi', 'Stripe'], cat: 'backend', ord: 6 }
    ];
    for (const p of projects) {
      await client.query(
        `INSERT INTO projects (title, description, tags, category, sort_order) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING`,
        [p.title, p.desc, p.tags, p.cat, p.ord]
      );
    }
    console.log('[Seed] Projeler eklendi:', projects.length);

    // References
    const refs = [
      { cn: 'Ahmet Yılmaz', pn: 'CEO, TechStart A.Ş.', t: 'Harika bir çalışma! Beklentilerin ötesinde teslim etti.', o: 1 },
      { cn: 'Ayşe Kaya', pn: 'CTO, DigitalCore', t: 'Profesyonel yaklaşımı ile karmaşık sorunlara hızlı çözümler.', o: 2 },
      { cn: 'Mehmet Demir', pn: 'Founder, InnoVent', t: 'UX önerileri ürünümüzü başka seviyeye taşıdı.', o: 3 }
    ];
    for (const r of refs) {
      await client.query(
        `INSERT INTO references_table (client_name, project_name, testimonial, sort_order) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [r.cn, r.pn, r.t, r.o]
      );
    }
    console.log('[Seed] Referanslar eklendi:', refs.length);
    console.log('[Seed] Tamamlandı.');
  } catch (err) {
    console.error('[Seed] Hata:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));
