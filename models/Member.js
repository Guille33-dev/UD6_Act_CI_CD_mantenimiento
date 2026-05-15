const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "El nombre completo es obligatorio."],
      minlength: [3, "El nombre completo debe tener al menos 3 caracteres."],
      maxlength: [120, "El nombre completo no puede superar 120 caracteres."]
    },
    membershipLevel: {
      type: String,
      enum: {
        values: ["basico", "premium", "vip"],
        message: "El nivel debe ser basico, premium o vip."
      },
      default: "basico"
    },
    age: {
      type: Number,
      required: [true, "La edad es obligatoria."],
      min: [12, "La edad mínima es 12 años."],
      max: [120, "La edad máxima es 120 años."]
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
