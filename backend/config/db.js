import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.warn("MongoDB connection warning:", error.message);
    console.warn("Please ensure MongoDB is running at " + process.env.MONGO_URI);
  }
}

export default connectDB;

