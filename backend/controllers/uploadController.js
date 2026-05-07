const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs');

// GET /api/upload/cv/latest
async function getLatestCv(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM uploads WHERE category = 'cv' ORDER BY uploaded_at DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV bulunamadı.', cv: null });
    }

    res.json({ cv: result.rows[0] });
  } catch (err) {
    console.error('[Upload] Get CV error:', err.message);
    res.status(500).json({ error: 'CV bilgisi alınamadı.' });
  }
}

// POST /api/upload/cv (admin)
async function uploadCv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi.' });
    }

    const file = req.file;
    const file_url = '/uploads/' + file.filename;

    const result = await pool.query(
      `INSERT INTO uploads (original_name, file_url, mime_type, size_bytes, category)
       VALUES ($1, $2, $3, $4, 'cv')
       RETURNING *`,
      [file.originalname, file_url, file.mimetype, file.size]
    );

    res.status(201).json({ cv: result.rows[0] });
  } catch (err) {
    console.error('[Upload] CV upload error:', err.message);
    res.status(500).json({ error: 'CV yüklenemedi.' });
  }
}

// DELETE /api/upload/:id
async function deleteUpload(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM uploads WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dosya bulunamadı.' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '..', result.rows[0].file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error('[Upload] Delete error:', err.message);
    res.status(500).json({ error: 'Dosya silinemedi.' });
  }
}

// GET /api/upload
async function listUploads(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM uploads ORDER BY uploaded_at DESC'
    );
    res.json({ uploads: result.rows });
  } catch (err) {
    console.error('[Upload] List error:', err.message);
    res.status(500).json({ error: 'Dosyalar listelenemedi.' });
  }
}

module.exports = { getLatestCv, uploadCv, deleteUpload, listUploads };
