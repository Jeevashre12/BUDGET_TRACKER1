import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import bcrypt from "bcryptjs";
import userModel from "./models/userModel.js";  
import recipeRouter from './routes/recipeRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectRecipesDB } from './config/mongodbRecipes.js';

// Initialize app FIRST
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Allow frontend origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => res.send("API working ✅"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use('/api/recipes', recipeRouter); // <--- move this AFTER app is defined

// Serve uploads statically (for local image fallback)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create default admin user if it doesn't exist
const createDefaultAdmin = async () => {
  try {
    const adminExists = await userModel.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new userModel({
        name: 'Admin',
        email: 'admin@recipedia.com',
        password: hashedPassword,
        isAccountVerified: true,
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Default admin created: admin@recipedia.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    // Connect recipes DB if configured
    if (process.env.MONGODB_URI_RECIPES) {
      await connectRecipesDB();
    }
    
    // Create default admin
    await createDefaultAdmin();
    
    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
