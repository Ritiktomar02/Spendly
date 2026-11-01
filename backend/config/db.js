import mongoose from "mongoose";

async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB connection failed: MONGO_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

export default connectDB;
