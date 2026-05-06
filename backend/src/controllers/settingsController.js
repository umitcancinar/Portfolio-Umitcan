const settingsService = require("../services/settingsService");

/**
 * GET /api/settings (public)
 */
async function get(req, res, next) {
  try {
    const settings = await settingsService.get();
    res.json({ settings });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/settings (admin only)
 */
async function update(req, res, next) {
  try {
    const settings = await settingsService.update(req.body);
    res.json({ message: "Settings updated successfully.", settings });
  } catch (error) {
    next(error);
  }
}

module.exports = { get, update };
