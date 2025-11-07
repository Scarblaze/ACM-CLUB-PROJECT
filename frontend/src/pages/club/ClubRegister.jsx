
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const apiBaseUrl = "https://acm-club-project-backend.onrender.com";

const ClubRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // Preview image immediately
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("password", formData.password);
      data.append("description", formData.description);
      if (image) {
        data.append("photo", image); // Append image file
      }

      const response = await axios.post(
        `${apiBaseUrl}/api/auth/club/register`, // Backend API for registering clubs
        data,
        { withCredentials: true } // Send cookies for session
      );

      toast.success("Club registered successfully!");
      navigate("/club/home"); // Redirect to the club's home page after successful registration
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Club registration failed!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Club Registration</h2>

        <input
          type="text"
          name="name"
          placeholder="Club Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Club Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description about the club..."
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg"
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
              className="mt-3 w-20 h-20 object-cover rounded-full"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          Register Club
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/club/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default ClubRegister;
