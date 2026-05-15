const mongoose = require("mongoose");

function errorHandler(error, req, res, next) {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: "Validación fallida.",
      details: Object.values(error.errors).map((err) => err.message)
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: "Formato de identificador no válido.",
      details: [`El valor '${error.value}' no es un ObjectId válido para '${error.path}'.`]
    });
  }

  return res.status(500).json({
    error: "Error interno del servidor.",
    details: [error.message]
  });
}

module.exports = { errorHandler };
