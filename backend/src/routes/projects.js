const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { authenticate, requireAdmin, optionalAuth } = require("../middleware/auth");

// GET /api/projects (public with optional auth)
router.get("/", optionalAuth, projectController.getAll);

// GET /api/projects/:slug (public with optional auth)
router.get("/:slug", optionalAuth, projectController.getBySlug);

// POST /api/projects (admin only)
router.post("/", authenticate, requireAdmin, projectController.create);

// PUT /api/projects/:id (admin only)
router.put("/:id", authenticate, requireAdmin, projectController.update);

// DELETE /api/projects/:id (admin only)
router.delete("/:id", authenticate, requireAdmin, projectController.remove);

module.exports = router;
