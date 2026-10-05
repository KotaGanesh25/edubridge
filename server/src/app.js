const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const learningRoutes = require("./routes/learning.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/learning", learningRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/chat", chatRoutes);


// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduBridge API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "EduBridge backend is healthy",
  });
});


// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


module.exports = app;