const blogService = require("../services/blogService");

/**
 * GET /api/blog
 */
async function getAll(req, res, next) {
  try {
    const isAdmin = req.user?.role === "admin";
    const published = isAdmin ? undefined : true;

    const { category, tag, search } = req.query;

    const posts = await blogService.getAll({
      published,
      category,
      tag,
      search,
    });

    res.json({ posts });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/blog/:slug
 */
async function getBySlug(req, res, next) {
  try {
    const post = await blogService.getBySlug(req.params.slug);

    if (!post.published && req.user?.role !== "admin") {
      return res.status(404).json({ error: "Blog post not found." });
    }

    res.json({ post });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/blog
 */
async function create(req, res, next) {
  try {
    const { title, slug, excerpt, content, coverImage, tags, published, readTime } = req.body;

    if (!title || !slug || !excerpt || !content) {
      return res.status(400).json({
        error: "Title, slug, excerpt, and content are required.",
      });
    }

    const post = await blogService.create(
      {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags: tags || [],
        published: published || false,
        readTime: readTime || 5,
      },
      req.user.id
    );

    res.status(201).json({ message: "Blog post created", post });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/blog/:id
 */
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid blog post ID." });
    }

    const post = await blogService.update(id, req.body);

    res.json({ message: "Blog post updated", post });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/blog/:id
 */
async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid blog post ID." });
    }

    await blogService.remove(id);

    res.json({ message: "Blog post deleted successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getBySlug, create, update, remove };
