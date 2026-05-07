const { pool } = require('../config/database');

/**
 * GET /api/chatbot/responses
 * Get all chatbot responses (admin)
 */
async function getAllResponses(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM chatbot_responses ORDER BY created_at DESC');
    const responses = result.rows;
    
    // Parse trigger_keywords from JSON string to array
    const parsed = responses.map(r => ({
      ...r,
      trigger_keywords: parseJsonArray(r.trigger_keywords)
    }));

    res.json({ responses: parsed });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/chatbot/responses
 * Create a new chatbot response (admin)
 */
async function createResponse(req, res, next) {
  try {
    const { trigger_keywords, response_text, is_active } = req.body;

    if (!trigger_keywords || !response_text) {
      return res.status(400).json({ error: 'Tetikleyici kelimeler ve yanıt metni gereklidir.' });
    }

    const keywordsStr = Array.isArray(trigger_keywords) 
      ? JSON.stringify(trigger_keywords) 
      : trigger_keywords;

    const result = await pool.query(`
      INSERT INTO chatbot_responses (trigger_keywords, response_text, is_active)
      VALUES ($1, $2, $3) RETURNING *
    `, [keywordsStr, response_text, is_active !== undefined ? is_active : true]);

    const response = result.rows[0];
    response.trigger_keywords = parseJsonArray(response.trigger_keywords);

    res.status(201).json({ message: 'Yanıt başarıyla eklendi.', response });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/chatbot/responses/:id
 * Update a chatbot response (admin)
 */
async function updateResponse(req, res, next) {
  try {
    const { id } = req.params;
    const { trigger_keywords, response_text, is_active } = req.body;

    const existingResult = await pool.query('SELECT id FROM chatbot_responses WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Yanıt bulunamadı.' });
    }

    const keywordsStr = Array.isArray(trigger_keywords) 
      ? JSON.stringify(trigger_keywords) 
      : trigger_keywords;

    await pool.query(`
      UPDATE chatbot_responses SET
        trigger_keywords = COALESCE($1, trigger_keywords),
        response_text = COALESCE($2, response_text),
        is_active = COALESCE($3, is_active)
      WHERE id = $4
    `, [
      keywordsStr ?? null,
      response_text ?? null,
      is_active !== undefined ? is_active : null,
      id
    ]);

    const result = await pool.query('SELECT * FROM chatbot_responses WHERE id = $1', [id]);
    const response = result.rows[0];
    response.trigger_keywords = parseJsonArray(response.trigger_keywords);

    res.json({ message: 'Yanıt başarıyla güncellendi.', response });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/chatbot/responses/:id
 * Delete a chatbot response (admin)
 */
async function deleteResponse(req, res, next) {
  try {
    const { id } = req.params;

    const existingResult = await pool.query('SELECT id FROM chatbot_responses WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Yanıt bulunamadı.' });
    }

    await pool.query('DELETE FROM chatbot_responses WHERE id = $1', [id]);

    res.json({ message: 'Yanıt başarıyla silindi.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/chatbot/query
 * Query the chatbot (public, rate limited)
 */
async function queryChatbot(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mesaj gereklidir.' });
    }

    const query = message.toLowerCase().trim();

    // Get all active responses
    const result = await pool.query('SELECT * FROM chatbot_responses WHERE is_active = TRUE');
    const responses = result.rows;

    // Find best matching response
    let bestMatch = null;
    let highestScore = 0;

    for (const response of responses) {
      const keywords = parseJsonArray(response.trigger_keywords);
      let score = 0;

      for (const keyword of keywords) {
        const kw = keyword.toLowerCase().trim();
        if (query.includes(kw)) {
          score += kw.length;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = response;
      }
    }

    if (bestMatch && highestScore > 0) {
      res.json({
        response: bestMatch.response_text,
        confidence: Math.min(highestScore / 100, 1)
      });
    } else {
      res.json({
        response: 'Üzgünüm, sorunuzu anlayamadım. Lütfen farklı bir şekilde tekrar deneyin veya iletişim bölümünden bana ulaşın.',
        confidence: 0
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Helper: Parse JSON array string to array
 */
function parseJsonArray(str) {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [str];
  } catch (e) {
    // If it's a comma-separated string, split it
    if (str.includes(',')) {
      return str.split(',').map(s => s.trim());
    }
    return [str];
  }
}

module.exports = {
  getAllResponses,
  createResponse,
  updateResponse,
  deleteResponse,
  queryChatbot,
};
