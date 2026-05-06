const { prisma } = require("../config/database");

/**
 * Get all projects with optional filtering
 */
async function getAll({ published, featured } = {}) {
  const where = {};

  if (published !== undefined) where.published = published;
  if (featured !== undefined) where.featured = featured;

  return prisma.project.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });
}

/**
 * Get project by slug
 */
async function getBySlug(slug) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });

  if (!project) {
    throw Object.assign(new Error("Project not found"), { statusCode: 404 });
  }

  return project;
}

/**
 * Get project by ID
 */
async function getById(id) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });

  if (!project) {
    throw Object.assign(new Error("Project not found"), { statusCode: 404 });
  }

  return project;
}

/**
 * Create a new project
 */
async function create(data, authorId) {
  return prisma.project.create({
    data: {
      ...data,
      authorId,
    },
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });
}

/**
 * Update a project
 */
async function update(id, data) {
  // Check if exists
  await getById(id);

  return prisma.project.update({
    where: { id },
    data,
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });
}

/**
 * Delete a project
 */
async function remove(id) {
  await getById(id);
  return prisma.project.delete({ where: { id } });
}

module.exports = {
  getAll,
  getBySlug,
  getById,
  create,
  update,
  remove,
};
