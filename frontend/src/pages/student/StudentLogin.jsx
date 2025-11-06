import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBaseUrl}/api/auth/student/login`, { email, password }, { withCredentials: true });

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
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <form onSubmit={loginHandler} className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">Student Login</h2>

        <input
          type="email"
          className="w-full mb-4 px-4 py-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-6 px-4 py-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>

        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/student/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
// done 
