import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import personaRoutes from "./routes/personas.js";
import articleRoutes from "./routes/articles.js";
import settingsRoutes from "./routes/settings.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", personaRoutes);
app.use("/api", articleRoutes);
app.use("/api", settingsRoutes);

// Serve React build in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientPath = path.join(__dirname, "../client");

app.use(express.static(clientPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
