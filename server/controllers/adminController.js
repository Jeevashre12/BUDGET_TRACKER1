import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// ADMIN LOGIN (DB + bcrypt)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: 'Email and Password are required' });
    }

    // find admin by email and role
    const admin = await userModel.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.json({ success: false, message: 'Invalid admin credentials' });
    }

    // compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid admin credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_key';
    const token = jwt.sign({ role: 'admin', id: admin._id }, jwtSecret, { expiresIn: '24h' });

    return res.json({ success: true, message: 'Admin login successful', token });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.json({ success: false, message: 'Something went wrong' });
  }
};

// GET USER ACTIVITY (protected)
export const getUserActivity = async (req, res) => {
  try {
    const users = await userModel.find({}, {
      name: 1,
      email: 1,
      isAccountVerified: 1,
      lastLogin: 1,
      createdAt: 1
    }).sort({ lastLogin: -1 });

    return res.json({ success: true, activity: users });
  } catch (error) {
    console.error('getUserActivity error:', error);
    return res.json({ success: false, message: 'Failed to fetch user activity' });
  }
};

// helper (optional) — update user's lastLogin
export const updateUserLastLogin = async (userId) => {
  try {
    await userModel.findByIdAndUpdate(userId, { lastLogin: new Date() });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};
