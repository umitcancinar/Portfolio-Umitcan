const express = require('express');
const router = express.Router();
const { getContent, getAllContent, updateContent } = require('../controllers/contentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public read
router.get('/', getAllContent);
router.get('/:section', getContent);

// Admin write
router.put('/:section', authenticateToken, requireRole('admin', 'editor'), updateContent);

module.exports = router;
