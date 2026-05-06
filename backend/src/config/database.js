const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

// Test database connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Neon PostgreSQL connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

// Graceful shutdown
async function disconnectDB() {
  await prisma.$disconnect();
  console.log("🔌 Database disconnected");
}

module.exports = { prisma, connectDB, disconnectDB };
