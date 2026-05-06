const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");

// GET /api/blog (public with optional auth)
router.get("/", optionalAuth, blogController.getAll);

// GET /api/blog/:slug (public with optional auth)
router.get("/:slug", optionalAuth, blogController.getBySlug);

// POST /api/blog (admin only)
router.post("/", authenticate, requireAdmin, blogController.create);

// PUT /api/blog/:id (admin only)
router.put("/:id", authenticate, requireAdmin, blogController.update);

// DELETE /api/blog/:id (admin only)
router.delete("/:id", authenticate, requireAdmin, blogController.remove);

module.exports = router;
