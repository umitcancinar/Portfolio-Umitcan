const { pool } = require('../config/database');

// POST /api/messages
async function createMessage(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'İsim, email ve mesaj zorunludur.' });
    }

    const result = await pool.query(
      `INSERT INTO messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, message, read, created_at`,
      [name, email, message]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (err) {
    console.error('[Messages] Create error:', err.message);
    res.status(500).json({ error: 'Mesaj gönderilemedi.' });
  }
}

// GET /api/messages (admin only)
async function getMessages(req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const countResult = await pool.query('SELECT COUNT(*) FROM messages');
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [parseInt(limit, 10), parseInt(offset, 10)]
    );

    res.json({ messages: result.rows, total, limit: parseInt(limit, 10), offset: parseInt(offset, 10) });
  } catch (err) {
    console.error('[Messages] List error:', err.message);
    res.status(500).json({ error: 'Mesajlar alınamadı.' });
  }
}

// GET /api/messages/:id
async function getMessage(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı.' });
    }

    res.json({ message: result.rows[0] });
  } catch (err) {
    console.error('[Messages] Get error:', err.message);
    res.status(500).json({ error: 'Mesaj alınamadı.' });
  }
}

// PATCH /api/messages/:id/read
async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE messages SET read = TRUE
       WHERE id = $1
       RETURNING id, name, email, message, read, created_at`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı.' });
    }

    res.json({ message: result.rows[0] });
  } catch (err) {
    console.error('[Messages] Mark read error:', err.message);
    res.status(500).json({ error: 'Mesaj güncellenemedi.' });
  }
}

// DELETE /api/messages/:id
async function deleteMessage(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı.' });
    }

    res.json({ success: true, deleted_id: parseInt(id, 10) });
  } catch (err) {
    console.error('[Messages] Delete error:', err.message);
    res.status(500).json({ error: 'Mesaj silinemedi.' });
  }
}

module.exports = { createMessage, getMessages, getMessage, markAsRead, deleteMessage };
