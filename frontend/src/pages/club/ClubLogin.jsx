import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ClubLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // NEW
  const navigate = useNavigate();

  const handleClubLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiBaseUrl}/api/auth/club/login`,
        { name, password },
        { withCredentials: true }
      );
      toast.success("Club Logged In!");
      navigate("/club/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center px-4">
      <form
        onSubmit={handleClubLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-transform transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          Club Login
        </h2>

        <input
          type="text"
          placeholder="Club Name"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Password with Show/Hide Toggle */}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-700">
          Don’t have an account?{" "}
          <a
            href="/club/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </a>
        </p>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClubLogin;
