const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título del libro es obligatorio."],
      minlength: [2, "El título debe tener al menos 2 caracteres."],
      maxlength: [120, "El título no puede superar 120 caracteres."]
    },
    genre: {
      type: String,
      enum: {
        values: ["novela", "ensayo", "poesia", "tecnico"],
        message: "El género debe ser novela, ensayo, poesia o tecnico."
      },
      required: [true, "El género del libro es obligatorio."]
    },
    pages: {
      type: Number,
      required: [true, "El número de páginas es obligatorio."],
      min: [10, "El libro debe tener al menos 10 páginas."],
      max: [2000, "El libro no puede superar 2000 páginas."]
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    available: {
      type: Boolean,
      default: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: [true, "El autor del libro es obligatorio."]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
