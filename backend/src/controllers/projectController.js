const projectService = require("../services/projectService");

/**
 * GET /api/projects
 */
async function getAll(req, res, next) {
  try {
    // Public: only show published; Admin: all
    const isAdmin = req.user?.role === "admin";
    const published = isAdmin ? undefined : true;
    const { featured } = req.query;

    const filter = {};
    if (published !== undefined) filter.published = published;
    if (featured !== undefined) filter.featured = featured === "true";

    const projects = await projectService.getAll(filter);

    res.json({ projects });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/projects/:slug
 */
async function getBySlug(req, res, next) {
  try {
    const project = await projectService.getBySlug(req.params.slug);

    // If not published and not admin
    if (!project.published && req.user?.role !== "admin") {
      return res.status(404).json({ error: "Project not found." });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/projects
 */
async function create(req, res, next) {
  try {
    const { title, slug, description, content, imageUrl, githubUrl, liveUrl, technologies, featured, order, published } = req.body;

    if (!title || !slug || !description || !content) {
      return res.status(400).json({
        error: "Title, slug, description, and content are required.",
      });
    }

    const project = await projectService.create(
      {
        title,
        slug,
        description,
        content,
        imageUrl,
        githubUrl,
        liveUrl,
        technologies: technologies || [],
        featured: featured || false,
        order: order || 0,
        published: published !== undefined ? published : true,
      },
      req.user.id
    );

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/projects/:id
 */
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid project ID." });
    }

    const project = await projectService.update(id, req.body);

    res.json({ message: "Project updated", project });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/projects/:id
 */
async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid project ID." });
    }

    await projectService.remove(id);

    res.json({ message: "Project deleted successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getBySlug, create, update, remove };
