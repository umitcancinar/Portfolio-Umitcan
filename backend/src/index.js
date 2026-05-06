require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { connectDB, disconnectDB } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Import routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const blogRoutes = require("./routes/blog");
const contactRoutes = require("./routes/contact");
const settingsRoutes = require("./routes/settings");

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api", apiLimiter);

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

// ──────────────────────────────────────────────
// Server start
// ──────────────────────────────────────────────
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║   🚀 Portfolio Backend Server            ║
║   ─────────────────────────────────────  ║
║   Port: ${String(PORT).padEnd(30)}║
║   Env:  ${String(process.env.NODE_ENV || "development").padEnd(30)}║
║   URL:  http://localhost:${String(PORT).padEnd(18)}║
╚══════════════════════════════════════════╝
    `);
  });
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await disconnectDB();
  process.exit(0);
});

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

module.exports = app;
