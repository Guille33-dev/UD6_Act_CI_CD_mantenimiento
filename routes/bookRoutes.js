const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const books = await Book.find()
      .populate("author", "name country status birthDate isAwarded")
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del libro no es válido." });
    }

    const book = await Book.findById(req.params.id).populate(
      "author",
      "name country status birthDate isAwarded"
    );

    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado." });
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    const populatedBook = await book.populate("author", "name country status birthDate isAwarded");
    res.status(201).json(populatedBook);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del libro no es válido." });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("author", "name country status birthDate isAwarded");

    if (!updatedBook) {
      return res.status(404).json({ error: "Libro no encontrado." });
    }

    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del libro no es válido." });
    }

    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ error: "Libro no encontrado." });
    }

    res.json({ message: "Libro eliminado correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
