const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { chatbotLimiter } = require('../middleware/rateLimiter');

// GET /api/chatbot/responses - Tüm chatbot yanıtları (admin)
router.get('/responses', authenticateToken, requireAdmin, chatbotController.getAllResponses);

// POST /api/chatbot/responses - Yanıt ekle (admin)
router.post('/responses', authenticateToken, requireAdmin, chatbotController.createResponse);

// PUT /api/chatbot/responses/:id - Yanıt güncelle (admin)
router.put('/responses/:id', authenticateToken, requireAdmin, chatbotController.updateResponse);

// DELETE /api/chatbot/responses/:id - Yanıt sil (admin)
router.delete('/responses/:id', authenticateToken, requireAdmin, chatbotController.deleteResponse);

// POST /api/chatbot/query - Chatbot sorgula (public, rate limited)
router.post('/query', chatbotLimiter, chatbotController.queryChatbot);

module.exports = router;
