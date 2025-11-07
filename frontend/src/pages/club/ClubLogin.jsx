import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const apiBaseUrl = "https://acm-club-project-backend.onrender.com";
const ClubLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <form
        onSubmit={handleClubLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Club Login</h2>

        <input
          type="text"
          placeholder="Club Name"
          required
          className="w-full mb-4 px-4 py-2 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-4 px-4 py-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <a href="/club/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default ClubLogin;
