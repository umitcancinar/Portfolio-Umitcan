const { prisma } = require("../config/database");

/**
 * Get all blog posts
 */
async function getAll({ published } = {}) {
  const where = {};

  if (published !== undefined) where.published = published;

  return prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });
}

/**
 * Get blog post by slug
 */
async function getBySlug(slug) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });

  if (!post) {
    throw Object.assign(new Error("Blog post not found"), { statusCode: 404 });
  }

  return post;
}

/**
 * Get blog post by ID
 */
async function getById(id) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true },
      },
    },
  });

  if (!post) {
    throw Object.assign(new Error("Blog post not found"), { statusCode: 404 });
  }

  return post;
}

/**
 * Create a new blog post
 */
async function create(data, authorId) {
  return prisma.blogPost.create({
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
 * Update a blog post
 */
async function update(id, data) {
  await getById(id);

  return prisma.blogPost.update({
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
 * Delete a blog post
 */
async function remove(id) {
  await getById(id);
  return prisma.blogPost.delete({ where: { id } });
}

module.exports = {
  getAll,
  getBySlug,
  getById,
  create,
  update,
  remove,
};
