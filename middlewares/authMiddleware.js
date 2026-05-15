const User = require("../models/User");
const { verifyAccessToken } = require("../utils/tokenUtils");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Debes enviar un token Bearer válido." });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).select("username roles");

    if (!user) {
      return res.status(401).json({ error: "Usuario no válido o ya no existente." });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      roles: user.roles
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o caducado." });
  }
}

module.exports = { requireAuth };
