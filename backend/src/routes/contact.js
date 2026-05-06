const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimiter");

// POST /api/contact (public, rate limited)
router.post("/", contactLimiter, contactController.create);

// GET /api/contact (admin only)
router.get("/", authenticate, requireAdmin, contactController.getAll);

// PATCH /api/contact/:id/read (admin only)
router.patch("/:id/read", authenticate, requireAdmin, contactController.markAsRead);

// DELETE /api/contact/:id (admin only)
router.delete("/:id", authenticate, requireAdmin, contactController.remove);

module.exports = router;
