const { pool } = require('../config/database');

/**
 * GET /api/game/scores
 * Get top scores (public)
 */
async function getTopScores(req, res, next) {
  try {
    const { limit, game_type } = req.query;
    const maxLimit = Math.min(parseInt(limit) || 10, 100);
    
    let query = 'SELECT id, player_name, score, game_type, created_at FROM game_scores';
    const params = [];
    let paramIndex = 1;

    if (game_type) {
      query += ` WHERE game_type = ${paramIndex}`;
      params.push(game_type);
      paramIndex++;
    }

    query += ` ORDER BY score DESC LIMIT ${paramIndex}`;
    params.push(maxLimit);

    const result = await pool.query(query, params);
    const scores = result.rows;

    res.json({ scores });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/game/scores
 * Save a new score (public)
 */
async function saveScore(req, res, next) {
  try {
    const { player_name, score, game_type } = req.body;

    if (!player_name || score === undefined) {
      return res.status(400).json({ error: 'Oyuncu adı ve skor gereklidir.' });
    }

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: 'Geçerli bir skor giriniz.' });
    }

    // Sanitize player name
    const sanitized = player_name.replace(/<[^>]*>/g, '').substring(0, 50);

    const result = await pool.query(
      'INSERT INTO game_scores (player_name, score, game_type) VALUES ($1, $2, $3) RETURNING *',
      [sanitized, score, game_type || 'classic']
    );

    const newScore = result.rows[0];

    res.status(201).json({ message: 'Skor kaydedildi.', score: newScore });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/game/scores/:id
 * Delete a score (admin)
 */
async function deleteScore(req, res, next) {
  try {
    const { id } = req.params;

    const existingResult = await pool.query('SELECT id FROM game_scores WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Skor bulunamadı.' });
    }

    await pool.query('DELETE FROM game_scores WHERE id = $1', [id]);

    res.json({ message: 'Skor başarıyla silindi.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTopScores,
  saveScore,
  deleteScore,
};
