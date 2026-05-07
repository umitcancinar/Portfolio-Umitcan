const express = require('express');
const router = express.Router();
const { createMessage, getMessages, getMessage, markAsRead, deleteMessage } = require('../controllers/messageController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public
router.post('/', createMessage);

// Admin only
router.get('/', authenticateToken, requireRole('admin', 'editor'), getMessages);
router.get('/:id', authenticateToken, requireRole('admin', 'editor'), getMessage);
router.patch('/:id/read', authenticateToken, requireRole('admin', 'editor'), markAsRead);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteMessage);

module.exports = router;
