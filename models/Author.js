const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del autor es obligatorio."],
      minlength: [2, "El nombre del autor debe tener al menos 2 caracteres."],
      maxlength: [100, "El nombre del autor no puede superar 100 caracteres."]
    },
    country: {
      type: String,
      default: "Desconocido",
      minlength: [2, "El país debe tener al menos 2 caracteres."],
      maxlength: [80, "El país no puede superar 80 caracteres."]
    },
    status: {
      type: String,
      enum: {
        values: ["activo", "retirado"],
        message: "El estado debe ser 'activo' o 'retirado'."
      },
      required: [true, "El estado del autor es obligatorio."],
      default: "activo"
    },
    birthDate: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria."]
    },
    isAwarded: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
