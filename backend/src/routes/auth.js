const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

// POST /api/auth/register
router.post("/register", authLimiter, authController.register);

// POST /api/auth/login
router.post("/login", authLimiter, authController.login);

// POST /api/auth/logout
router.post("/logout", authController.logout);

// GET /api/auth/me (protected)
router.get("/me", authenticate, authController.me);

// GET /api/auth/users (admin only)
router.get("/users", authenticate, requireAdmin, authController.getAllUsers);

module.exports = router;
