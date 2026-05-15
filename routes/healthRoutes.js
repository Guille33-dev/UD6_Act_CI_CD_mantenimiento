const express = require("express");
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

const router = express.Router();

router.get("/health", async (req, res) => {
  const apiStatus = "ok";
  const dbState = mongoose.connection.readyState;
  const dbStatusByState = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  try {
    if (dbState !== 1) {
      logger.warn("Health check failed: database is not connected", {
        dbState,
        dbStatus: dbStatusByState[dbState] || "unknown"
      });

      return res.status(503).json({
        status: "error",
        api: apiStatus,
        database: dbStatusByState[dbState] || "unknown",
        timestamp: new Date().toISOString()
      });
    }

    await mongoose.connection.db.admin().ping();

    logger.info("Health check passed", {
      database: "connected"
    });

    return res.status(200).json({
      status: "ok",
      api: apiStatus,
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Health check failed: database ping error", {
      error: error.message
    });

    return res.status(503).json({
      status: "error",
      api: apiStatus,
      database: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
