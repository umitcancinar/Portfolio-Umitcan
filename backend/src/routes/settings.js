const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { authenticate, requireAdmin } = require("../middleware/auth");

// GET /api/settings (public)
router.get("/", settingsController.get);

// PUT /api/settings (admin only)
router.put("/", authenticate, requireAdmin, settingsController.update);

module.exports = router;
