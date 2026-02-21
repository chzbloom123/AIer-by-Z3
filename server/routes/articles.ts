import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Public: list all articles (newest first, include persona name)
router.get("/articles", async (_req, res) => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { persona: { select: { id: true, name: true } } },
  });
  res.json(articles);
});

// Public: one article with persona info
router.get("/articles/:id", async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
    include: { persona: true },
  });
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }
  res.json(article);
});

// Admin: create article
router.post("/admin/articles", requireAuth, async (req, res) => {
  const { title, body, personaId } = req.body;
  const article = await prisma.article.create({
    data: { title, body, personaId },
    include: { persona: { select: { id: true, name: true } } },
  });
  res.status(201).json(article);
});

// Admin: edit article
router.put("/admin/articles/:id", requireAuth, async (req, res) => {
  const { title, body, personaId } = req.body;
  const id = req.params.id as string;
  const article = await prisma.article.update({
    where: { id },
    data: { title, body, personaId },
    include: { persona: { select: { id: true, name: true } } },
  });
  res.json(article);
});

// Admin: delete article
router.delete("/admin/articles/:id", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  await prisma.article.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
