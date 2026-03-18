import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

// In-memory storage for the Roblox Explorer tree
let robloxTree: any = {
  id: "root",
  Name: "game",
  ClassName: "DataModel",
  expanded: true,
  Children: []
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Endpoint to receive the Explorer tree from Roblox Studio
  app.post("/api/sync", (req, res) => {
    try {
      if (req.body && req.body.tree) {
        robloxTree = req.body.tree;
        res.json({ success: true, message: "Tree synced successfully" });
      } else {
        res.status(400).json({ success: false, message: "Invalid payload" });
      }
    } catch (error) {
      console.error("Error syncing tree:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Endpoint for the web app to poll the latest tree
  app.get("/api/sync", (req, res) => {
    res.json({ tree: robloxTree });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
