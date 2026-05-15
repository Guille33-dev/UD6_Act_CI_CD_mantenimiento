const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ALLOWED_ROLES = ["user", "admin"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El nombre de usuario es obligatorio."],
      unique: true,
      trim: true,
      minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres."],
      maxlength: [30, "El nombre de usuario no puede superar 30 caracteres."]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
      select: false
    },
    roles: {
      type: [String],
      enum: {
        values: ALLOWED_ROLES,
        message: "Los roles permitidos son user y admin."
      },
      default: ["user"]
    },
    refreshToken: {
      type: String,
      default: null,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
