function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Debes iniciar sesión para acceder." });
    }

    const hasRequiredRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ error: "No tienes permisos suficientes para esta operación." });
    }

    next();
  };
}

module.exports = { requireRole };
