const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

/**
 * Verify JWT token and attach user to request
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // { id, email, username, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

/**
 * Require admin role for protected routes
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
}

/**
 * Optional: attach user if token exists, but don't block
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
    } catch {
      // Token invalid, proceed without user
    }
  }

  next();
}

module.exports = { authenticate, requireAdmin, optionalAuth };
