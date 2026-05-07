const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/game/scores - En yüksek skorlar (public)
router.get('/scores', gameController.getTopScores);

// POST /api/game/scores - Skor kaydet (public)
router.post('/scores', gameController.saveScore);

// DELETE /api/game/scores/:id - Skor sil (admin)
router.delete('/scores/:id', authenticateToken, requireAdmin, gameController.deleteScore);

module.exports = router;
