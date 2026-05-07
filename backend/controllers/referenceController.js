const { pool } = require('../config/database');

// GET /api/references
async function getReferences(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM references_table ORDER BY sort_order ASC, created_at DESC'
    );

    res.json({ references: result.rows });
  } catch (err) {
    console.error('[References] List error:', err.message);
    res.status(500).json({ error: 'Referanslar alınamadı.' });
  }
}

// GET /api/references/:id
async function getReference(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM references_table WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Referans bulunamadı.' });
    }

    res.json({ reference: result.rows[0] });
  } catch (err) {
    console.error('[References] Get error:', err.message);
    res.status(500).json({ error: 'Referans alınamadı.' });
  }
}

// POST /api/references
async function createReference(req, res) {
  try {
    const { client_name, project_name, testimonial, description, logo_url, link_url, sort_order } = req.body;

    if (!client_name) {
      return res.status(400).json({ error: 'Müşteri adı zorunludur.' });
    }

    const result = await pool.query(
      `INSERT INTO references_table (client_name, project_name, testimonial, description, logo_url, link_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [client_name, project_name || null, testimonial || null, description || null, logo_url || null, link_url || null, sort_order || 0]
    );

    res.status(201).json({ reference: result.rows[0] });
  } catch (err) {
    console.error('[References] Create error:', err.message);
    res.status(500).json({ error: 'Referans oluşturulamadı.' });
  }
}

// PUT /api/references/:id
async function updateReference(req, res) {
  try {
    const { id } = req.params;
    const { client_name, project_name, testimonial, description, logo_url, link_url, sort_order } = req.body;

    const result = await pool.query(
      `UPDATE references_table
       SET client_name = COALESCE($1, client_name),
           project_name = COALESCE($2, project_name),
           testimonial = COALESCE($3, testimonial),
           description = COALESCE($4, description),
           logo_url = COALESCE($5, logo_url),
           link_url = COALESCE($6, link_url),
           sort_order = COALESCE($7, sort_order)
       WHERE id = $8
       RETURNING *`,
      [client_name || null, project_name || null, testimonial || null, description || null, logo_url || null, link_url || null, sort_order ?? null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Referans bulunamadı.' });
    }

    res.json({ reference: result.rows[0] });
  } catch (err) {
    console.error('[References] Update error:', err.message);
    res.status(500).json({ error: 'Referans güncellenemedi.' });
  }
}

// DELETE /api/references/:id
async function deleteReference(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM references_table WHERE id = $1 RETURNING id, client_name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Referans bulunamadı.' });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error('[References] Delete error:', err.message);
    res.status(500).json({ error: 'Referans silinemedi.' });
  }
}

module.exports = { getReferences, getReference, createReference, updateReference, deleteReference };
