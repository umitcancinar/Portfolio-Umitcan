const contactService = require("../services/contactService");

/**
 * POST /api/contact (public)
 */
async function create(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "Name, email, subject, and message are required.",
      });
    }

    const contactMessage = await contactService.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully. I'll get back to you soon!",
      contactMessage,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/contact (admin only)
 */
async function getAll(req, res, next) {
  try {
    const { read } = req.query;
    const filter = {};

    if (read !== undefined) filter.read = read === "true";

    const messages = await contactService.getAll(filter);

    res.json({ messages });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/contact/:id/read (admin only)
 */
async function markAsRead(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid message ID." });
    }

    const message = await contactService.markAsRead(id);

    res.json({ message: "Message marked as read.", contactMessage: message });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/contact/:id (admin only)
 */
async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid message ID." });
    }

    await contactService.remove(id);

    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, getAll, markAsRead, remove };
