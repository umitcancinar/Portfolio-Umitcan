const { prisma } = require("../config/database");

/**
 * Create a contact message (public)
 */
async function create({ name, email, subject, message }) {
  return prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message,
    },
  });
}

/**
 * Get all contact messages (admin only)
 */
async function getAll({ read } = {}) {
  const where = {};
  if (read !== undefined) where.read = read;

  return prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Mark message as read (admin only)
 */
async function markAsRead(id) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });

  if (!message) {
    throw Object.assign(new Error("Message not found"), { statusCode: 404 });
  }

  return prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
}

/**
 * Delete a contact message (admin only)
 */
async function remove(id) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });

  if (!message) {
    throw Object.assign(new Error("Message not found"), { statusCode: 404 });
  }

  return prisma.contactMessage.delete({ where: { id } });
}

module.exports = {
  create,
  getAll,
  markAsRead,
  remove,
};
