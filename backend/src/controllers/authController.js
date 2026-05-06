const authService = require("../services/authService");

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        error: "Email, username, and password are required.",
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    const result = await authService.register({ email, username, password });

    res.status(201).json({
      message: "User registered successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const result = await authService.login({ email, password });

    res.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Client-side token invalidation (stateless JWT)
 */
async function logout(req, res) {
  res.json({ message: "Logout successful. Please remove the token client-side." });
}

/**
 * GET /api/auth/me
 * Return current authenticated user
 */
async function me(req, res, next) {
  try {
    const { prisma } = require("../config/database");
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, me };
