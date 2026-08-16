import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "https://interview-practice-ai-sn99-8uxairuqx-anshsingh-20s-projects.vercel.app",
  "https://interview-practice-ai-8ekg.onrender.com",
  "http://localhost:5173",
  "http://localhost:5000",
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server running on port ${PORT}`);
});

// middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI interview  API is running" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "An unecpected error  occurred",
  });
});

//database connection

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log("database connection failed", error);
  });
