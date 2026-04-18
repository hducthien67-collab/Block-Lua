import express from "express";
import cors from "cors";

// In-memory storage (Note: ephemereal on Vercel)
let robloxTree: any = {
  id: "root",
  Name: "game",
  ClassName: "DataModel",
  expanded: true,
  Children: []
};

let pendingScript: any = null;
let pendingTree: any = null;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

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

app.get("/api/sync", (req, res) => {
  res.json({ tree: robloxTree });
});

app.post("/api/export", (req, res) => {
  try {
    if (req.body && req.body.type && req.body.path && req.body.code) {
      pendingScript = req.body;
      res.json({ success: true, message: "Script queued for export" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payload" });
    }
  } catch (error) {
    console.error("Error queueing script:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/export", (req, res) => {
  res.json({ script: pendingScript });
  pendingScript = null;
});

app.post("/api/export_tree", (req, res) => {
  try {
    if (req.body && req.body.tree) {
      pendingTree = req.body.tree;
      res.json({ success: true, message: "Tree queued for export" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payload" });
    }
  } catch (error) {
    console.error("Error queueing tree:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/export_tree", (req, res) => {
  res.json({ tree: pendingTree });
  pendingTree = null;
});

export default app;
