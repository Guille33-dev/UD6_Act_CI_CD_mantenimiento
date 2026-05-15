const express = require("express");
const mongoose = require("mongoose");
const Author = require("../models/Author");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del autor no es válido." });
    }

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado." });
    }

    res.json(author);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del autor no es válido." });
    }

    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado." });
    }

    res.json(author);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del autor no es válido." });
    }

    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado." });
    }

    res.json({ message: "Autor eliminado correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
