import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/auth/student/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        toast.success("Logged in successfully");
        navigate("/student/home");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={loginHandler}
        className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md transition-transform transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700">
          Student Login
        </h2>

        <input
          type="email"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* password with show/hide toggle */}
        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-12"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
          <span
            onClick={() => navigate("/student/register")}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>

        {/* Stylish Back to Home button */}
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
}
