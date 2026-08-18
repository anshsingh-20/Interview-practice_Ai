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
  process.env.FRONTEND_URL,
  "https://interview-practice-ai-sn99.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
].filter(Boolean);

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowedOrigin =
    !origin ||
    allowedOrigins.includes(origin) ||
    /https?:\/\/.*\.vercel\.app$/i.test(origin || "") ||
    /https?:\/\/.*\.onrender\.com$/i.test(origin || "");

  if (isAllowedOrigin) {
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
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

// middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI interview API is running" });
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

if (!MONGO_URI) {
  console.error(
    "MONGO_URI is missing. Add it to backend/.env before running the server.",
  );
}

const startServer = async () => {
  if (!MONGO_URI) {
    console.error(
      "MONGO_URI is missing. Add it to backend/.env before running the server.",
    );
  }

  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("database connected successfully");
    }
  } catch (error) {
    console.error("database connection failed", error.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`server running on port ${PORT}`);
  });
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

startServer();
