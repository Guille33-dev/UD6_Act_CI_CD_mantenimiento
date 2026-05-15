const express = require("express");
const mongoose = require("mongoose");
const Member = require("../models/Member");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del miembro no es válido." });
    }

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Miembro no encontrado." });
    }

    res.json(member);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del miembro no es válido." });
    }

    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!member) {
      return res.status(404).json({ error: "Miembro no encontrado." });
    }

    res.json(member);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del miembro no es válido." });
    }

    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Miembro no encontrado." });
    }

    res.json({ message: "Miembro eliminado correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
