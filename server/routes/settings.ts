import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Public: get site settings
router.get("/settings", async (_req, res) => {
  const settings = await prisma.settings.findUnique({ where: { id: "site" } });
  if (!settings) {
    res.status(404).json({ error: "Settings not found" });
    return;
  }
  res.json(settings);
});

// Admin: update site settings
router.put("/admin/settings", requireAuth, async (req, res) => {
  const { siteName, tagline, isPublic } = req.body;
  const settings = await prisma.settings.upsert({
    where: { id: "site" },
    update: { siteName, tagline, isPublic },
    create: { id: "site", siteName, tagline, isPublic },
  });
  res.json(settings);
});

export default router;
