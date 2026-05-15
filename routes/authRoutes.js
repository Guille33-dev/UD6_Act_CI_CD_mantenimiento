const express = require("express");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/tokenUtils");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, roles } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "El nombre de usuario ya está en uso." });
    }

    const user = new User({
      username,
      password,
      roles: Array.isArray(roles) && roles.length > 0 ? roles : ["user"]
    });

    await user.save();

    res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Inicio de sesión correcto.",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Debes enviar el refresh token." });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub).select("+refreshToken username roles");

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Refresh token inválido." });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      message: "Token refrescado correctamente.",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    return res.status(401).json({ error: "Refresh token inválido o caducado." });
  }
});

module.exports = router;
