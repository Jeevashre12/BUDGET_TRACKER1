import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { OAuth2Client } from "google-auth-library";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// GOOGLE OAUTH CLIENT
let googleClient = null;
if (process.env.GOOGLE_CLIENT_ID) {
  googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

// Email helper: only send if SMTP creds are configured
const canSendEmail = !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SENDER_EMAIL);
const sendMailIfConfigured = async (mailOptions) => {
  if (!canSendEmail) return; // silently skip in dev if not configured
  await transporter.sendMail({ from: process.env.SENDER_EMAIL, ...mailOptions });
};

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id);

    // ✅ Simplified cookie config for dev
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true only on production + https
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await sendMailIfConfigured({
      to: user.email,
      subject: "Welcome to Recipe Sharing APP",
      text: `Welcome! Your account has been created with email: ${user.email}`,
    });

    return res.json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({
      success: false,
      message: "Email and Password are required",
    });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid Password" });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    // ✅ Fix: cookie config
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true only on production + https
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// SEND VERIFICATION OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found with this email" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendMailIfConfigured({
      to: user.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
    });

    return res.json({ success: true, message: "Verification OTP sent on Email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) return res.json({ success: false, message: "Email and OTP are required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.verifyOtp !== otp) return res.json({ success: false, message: "Invalid OTP" });
    if (user.verifyOtpExpireAt < Date.now()) return res.json({ success: false, message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ FIXED CHECK AUTH
export const isAuthenticated = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    const user = await userModel.findById(req.userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// SEND PASSWORD RESET OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendMailIfConfigured({
      to: user.email,
      subject: "Password reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
    });

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({
      success: false,
      message: "Email, OTP, and new Password are required",
    });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });
    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// GOOGLE SIGN-IN
export const googleAuth = async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({ success: false, message: "Google auth not configured" });
    }
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing Google credential" });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } catch (e) {
      return res.status(401).json({ success: false, message: "Invalid Google credential" });
    }
    const email = payload?.email;
    const name = payload?.name || email?.split("@")[0] || "User";
    const emailVerified = payload?.email_verified;
    if (!email) {
      return res.status(400).json({ success: false, message: "Google email not available" });
    }
    if (emailVerified === false) {
      return res.status(401).json({ success: false, message: "Google email not verified" });
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      user = new userModel({
        name,
        email,
        password: await bcrypt.hash(jwt.sign({ email }, process.env.JWT_SECRET), 10),
        isAccountVerified: true,
        role: "user",
        lastLogin: new Date()
      });
      await user.save();
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Google login successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error during Google login" });
  }
};
