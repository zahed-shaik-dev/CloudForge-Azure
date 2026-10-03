const express = require("express");
const router = express.Router();
let tasks = [
  { id: 1, title: "Configure Azure App Service", completed: true },
  { id: 2, title: "Create GitHub Actions pipeline", completed: false },
  { id: 3, title: "Configure Application Insights", completed: false },
];
router.get("/", (_req, res) => res.json(tasks));
router.post("/", (req, res) => {
  const title = String(req.body?.title || "").trim();
  if (!title) return res.status(400).json({ error: "Task title is required" });
  const task = { id: Date.now(), title, completed: false };
  tasks.unshift(task);
  res.status(201).json(task);
});
router.patch("/:id", (req, res) => {
  const task = tasks.find((x) => x.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (typeof req.body?.completed === "boolean")
    task.completed = req.body.completed;
  if (typeof req.body?.title === "string" && req.body.title.trim())
    task.title = req.body.title.trim();
  res.json(task);
});
router.delete("/:id", (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((x) => x.id !== Number(req.params.id));
  if (tasks.length === before)
    return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
});
module.exports = router;
