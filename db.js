const mongoose = require("mongoose");
const { logger } = require("./utils/logger");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ud6_biblioteca";

  try {
    await mongoose.connect(mongoUri);
    logger.info("Connected to MongoDB", {
      database: mongoose.connection.name
    });
  } catch (error) {
    logger.error("MongoDB connection error", {
      error: error.message
    });
    process.exit(1);
  }
}

module.exports = { connectDB };
