import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@recipedia.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    let admin = await userModel.findOne({ email: ADMIN_EMAIL });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (!admin) {
      admin = new userModel({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        isAccountVerified: true,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin created:', ADMIN_EMAIL);
    } else {
      // ensure admin role and update password
      admin.role = 'admin';
      admin.password = hashedPassword;
      admin.isAccountVerified = true;
      await admin.save();
      console.log('Admin updated:', ADMIN_EMAIL);
    }

    console.log('Use these to login (email/password):', ADMIN_EMAIL, ADMIN_PASSWORD);
  } catch (err) {
    console.error('createAdmin error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
