const { pool } = require('../config/database');

// GET /api/projects
async function getProjects(req, res) {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM projects';
    const params = [];

    if (category && category !== 'all') {
      query += ' WHERE category = $1';
      params.push(category);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const result = await pool.query(query, params);
    res.json({ projects: result.rows });
  } catch (err) {
    console.error('[Projects] List error:', err.message);
    res.status(500).json({ error: 'Projeler alınamadı.' });
  }
}

// GET /api/projects/:id
async function getProject(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proje bulunamadı.' });
    }

    res.json({ project: result.rows[0] });
  } catch (err) {
    console.error('[Projects] Get error:', err.message);
    res.status(500).json({ error: 'Proje alınamadı.' });
  }
}

// POST /api/projects (admin)
async function createProject(req, res) {
  try {
    const { title, description, tags, image_url, link_url, category, sort_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Proje başlığı zorunludur.' });
    }

    const result = await pool.query(
      `INSERT INTO projects (title, description, tags, image_url, link_url, category, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description || null, tags || [], image_url || null, link_url || null, category || 'frontend', sort_order || 0]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error('[Projects] Create error:', err.message);
    res.status(500).json({ error: 'Proje oluşturulamadı.' });
  }
}

// PUT /api/projects/:id
async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title, description, tags, image_url, link_url, category, sort_order } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           tags = COALESCE($3, tags),
           image_url = COALESCE($4, image_url),
           link_url = COALESCE($5, link_url),
           category = COALESCE($6, category),
           sort_order = COALESCE($7, sort_order)
       WHERE id = $8
       RETURNING *`,
      [title || null, description || null, tags || null, image_url || null, link_url || null, category || null, sort_order ?? null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proje bulunamadı.' });
    }

    res.json({ project: result.rows[0] });
  } catch (err) {
    console.error('[Projects] Update error:', err.message);
    res.status(500).json({ error: 'Proje güncellenemedi.' });
  }
}

// DELETE /api/projects/:id
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id, title',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proje bulunamadı.' });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error('[Projects] Delete error:', err.message);
    res.status(500).json({ error: 'Proje silinemedi.' });
  }
}

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
