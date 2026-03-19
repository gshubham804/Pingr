import mongoose from "mongoose";

export const connectDB = async () => {
  try {

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

  } catch (error) {

    console.error("MongoDB connection failed:", error);

    process.exit(1);
  }
};