const express = require('express');
const router = express.Router();
const { register, login, verifyToken, changePassword, me } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', authenticateToken, verifyToken);
router.post('/change-password', authenticateToken, changePassword);
router.get('/me', authenticateToken, me);

module.exports = router;
