const jwt = require("jsonwebtoken");

function ensureJwtConfig() {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      "Faltan JWT_SECRET o JWT_REFRESH_SECRET en las variables de entorno."
    );
  }
}

function buildPayload(user) {
  return {
    sub: user._id.toString(),
    username: user.username,
    roles: user.roles
  };
}

function generateAccessToken(user) {
  ensureJwtConfig();
  return jwt.sign(buildPayload(user), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m"
  });
}

function generateRefreshToken(user) {
  ensureJwtConfig();
  return jwt.sign(buildPayload(user), process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  });
}

function verifyAccessToken(token) {
  ensureJwtConfig();
  return jwt.verify(token, process.env.JWT_SECRET);
}

function verifyRefreshToken(token) {
  ensureJwtConfig();
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
