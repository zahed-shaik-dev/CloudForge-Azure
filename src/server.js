const express = require("express");
const path = require("path");
const tasksRouter = require("./routes/tasks");
const capabilitiesRouter = require("./routes/capabilities");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/api/health", (_req, res) =>
  res.json({
    status: "healthy",
    service: "cloudops-taskhub",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  }),
);
app.use("/api/tasks", tasksRouter);
app.use("/api/capabilities", capabilitiesRouter);
app.get("*splat", (_req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "index.html")),
);
app.listen(PORT, () => console.log(`CloudOps TaskHub running on port ${PORT}`));
module.exports = app;
