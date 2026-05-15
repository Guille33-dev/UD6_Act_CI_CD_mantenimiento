require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./db");
const { logger } = require("./utils/logger");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    logger.info("Server started", {
      port: PORT,
      environment: process.env.NODE_ENV || "development"
    });
  });
}

startServer();
