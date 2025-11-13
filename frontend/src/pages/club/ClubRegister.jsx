import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // Added icons

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ClubRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showPassword, setShowPassword] = useState(false); // NEW

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("password", formData.password);
      data.append("description", formData.description);

      if (image) {
        data.append("photo", image);
      }

      await axios.post(`${apiBaseUrl}/api/auth/club/register`, data, {
        withCredentials: true,
      });

      toast.success("Club registered successfully!");
      navigate("/club/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Club registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4 transition-transform transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-4">
          Club Registration
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Club Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        {/* Password with Show/Hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Club Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <textarea
          name="description"
          placeholder="Description about the club..."
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <div>
          <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200">
            Upload Club Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Club Preview"
              className="mt-3 w-20 h-20 object-cover rounded-full shadow"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
        >
          Register Club
        </button>

        <p className="text-center mt-4 text-gray-700">
          Already have an account?{" "}
          <a
            href="/club/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>

        {/* Back to Home */}
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

export default ClubRegister;
