const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// GET /api/users
async function getUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({ users: result.rows });
  } catch (err) {
    console.error('[Users] List error:', err.message);
    res.status(500).json({ error: 'Kullanıcılar alınamadı.' });
  }
}

// GET /api/users/:id
async function getUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[Users] Get error:', err.message);
    res.status(500).json({ error: 'Kullanıcı alınamadı.' });
  }
}

// PUT /api/users/:id
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;

    let updateQuery = 'UPDATE users SET ';
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (username) {
      updates.push(`username = $${paramIndex}`);
      params.push(username);
      paramIndex++;
    }
    if (email) {
      updates.push(`email = $${paramIndex}`);
      params.push(email);
      paramIndex++;
    }
    if (role) {
      updates.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }
    if (password) {
      const hash = await bcrypt.hash(password, 12);
      updates.push(`password_hash = $${paramIndex}`);
      params.push(hash);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Güncellenecek alan bulunamadı.' });
    }

    updateQuery += updates.join(', ');
    updateQuery += ` WHERE id = $${paramIndex} RETURNING id, username, email, role, created_at`;
    params.push(id);

    const result = await pool.query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[Users] Update error:', err.message);
    res.status(500).json({ error: 'Kullanıcı güncellenemedi.' });
  }
}

// DELETE /api/users/:id
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error('[Users] Delete error:', err.message);
    res.status(500).json({ error: 'Kullanıcı silinemedi.' });
  }
}

module.exports = { getUsers, getUser, updateUser, deleteUser };
