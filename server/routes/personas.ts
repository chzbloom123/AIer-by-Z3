import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Public: list all personas
router.get("/personas", async (_req, res) => {
  const personas = await prisma.persona.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(personas);
});

// Public: one persona with their articles
router.get("/personas/:id", async (req, res) => {
  const persona = await prisma.persona.findUnique({
    where: { id: req.params.id },
    include: { articles: { orderBy: { createdAt: "desc" } } },
  });
  if (!persona) {
    res.status(404).json({ error: "Persona not found" });
    return;
  }
  res.json(persona);
});

// Admin: create persona
router.post("/admin/personas", requireAuth, async (req, res) => {
  const { name, bio, role, imageUrl } = req.body;
  const persona = await prisma.persona.create({
    data: { name, bio, role, imageUrl },
  });
  res.status(201).json(persona);
});

export default router;
