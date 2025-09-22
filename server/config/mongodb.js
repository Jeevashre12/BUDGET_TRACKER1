import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    // MongoDB connection options (remove deprecated options for Mongoose 8+)
    const options = {
      writeConcern: {
        w: 1,
        j: false,
      },
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB with proper options
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error; // Re-throw to handle in server.js
  }
};

export default connectDB;