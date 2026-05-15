function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const base = { timestamp, level, message, ...meta };
  return JSON.stringify(base);
}

const logger = {
  info(message, meta) {
    console.log(formatLog("info", message, meta));
  },
  warn(message, meta) {
    console.warn(formatLog("warn", message, meta));
  },
  error(message, meta) {
    console.error(formatLog("error", message, meta));
  }
};

module.exports = { logger };
