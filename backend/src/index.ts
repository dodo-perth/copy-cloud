import express from "express";
import cors from "cors";
import path from "path";
import roomsRouter from "./routes/rooms";
import { startCleanupScheduler } from "./utils/cleanup";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - allow frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api/rooms", roomsRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start cleanup scheduler (every 30 seconds)
startCleanupScheduler(30_000);

app.listen(PORT, () => {
  console.log(`[server] copy-cloud backend running on http://localhost:${PORT}`);
});
