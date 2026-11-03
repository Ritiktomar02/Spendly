import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB before starting the server
await connectDB();

const app = express();

// Allow requests from the React frontend (running on port 5173)
app.use(cors({ origin: "http://localhost:5173" }));

// Parse incoming JSON request bodies
app.use(express.json());

// Simple health-check route
app.get("/", (req, res) => {
  res.json({ message: "Spendly API is running" });
});

// Auth routes (registration)
app.use("/api/auth", authRoutes);

// Profile data for the logged-in user
app.use("/api/profile", profileRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
