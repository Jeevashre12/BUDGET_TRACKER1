import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaEnvelope, FaLock } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        alert("✅ Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        alert("❌ " + (data.message || "Login failed"));
      }
    } catch (err) {
      console.error("Admin login error:", err);
      alert("Error logging in");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{
        background: "linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b7 100%)",
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#5a4a42] mb-2">
          Admin Login
        </h2>
        <p className="text-center text-sm text-[#8b7355] mb-6">
          Enter your credentials to access the admin panel
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#f8f4f0] border border-[#e7ddd6]">
            <FaEnvelope className="text-[#a89b8c]" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent outline-none text-[#5a4a42] placeholder-[#a89b8c]"
            />
          </div>

          {/* Password input */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#f8f4f0] border border-[#e7ddd6]">
            <FaLock className="text-[#a89b8c]" />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 bg-transparent outline-none text-[#5a4a42] placeholder-[#a89b8c]"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-[#5a4a42] to-[#8b7355] text-white hover:from-[#4a3d37] hover:to-[#7a6b5a] shadow-lg transition-all duration-200"
          >
            Login
          </button>
        </form>

        {/* Extra links */}
        <div className="text-center mt-4">
         
          <p className="text-sm mt-2 text-[#8b7355]">
            Not an admin?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Go to user login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
