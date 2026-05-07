const { pool } = require('../config/database');

// GET /api/content/:section
async function getContent(req, res) {
  try {
    const { section } = req.params;

    const result = await pool.query(
      'SELECT section, data, updated_at FROM content WHERE section = $1',
      [section]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'İçerik bulunamadı.', content: null });
    }

    res.json({ section: result.rows[0].section, content: result.rows[0].data, updated_at: result.rows[0].updated_at });
  } catch (err) {
    console.error('[Content] Get error:', err.message);
    res.status(500).json({ error: 'İçerik alınamadı.' });
  }
}

// GET /api/content
async function getAllContent(req, res) {
  try {
    const result = await pool.query('SELECT section, data, updated_at FROM content ORDER BY section ASC');
    const sections = result.rows.map(row => ({
      section_key: row.section,
      content: row.data,
      subtitle: row.data.subtitle || '',
      updated_at: row.updated_at
    }));
    res.json({ sections });
  } catch (err) {
    console.error('[Content] List error:', err.message);
    res.status(500).json({ error: 'İçerikler alınamadı.' });
  }
}

// PUT /api/content/:section (admin)
async function updateContent(req, res) {
  try {
    const { section } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'content alanı zorunludur.' });
    }

    const result = await pool.query(
      `INSERT INTO content (section, data, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (section)
       DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING section, data, updated_at`,
      [section, JSON.stringify(content)]
    );

    res.json({ section: result.rows[0].section, content: result.rows[0].data, updated_at: result.rows[0].updated_at });
  } catch (err) {
    console.error('[Content] Update error:', err.message);
    res.status(500).json({ error: 'İçerik güncellenemedi.' });
  }
}

module.exports = { getContent, getAllContent, updateContent };
