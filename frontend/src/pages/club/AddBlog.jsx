import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

import { toast } from "react-toastify";
const AddBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
 const  [images, setImages] = useState([]);
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !description || !images) {
    toast.error("All fields are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("coverimg", image);
  images.forEach((img) => formData.append("photos", img)); 

  try {
    const res = await axios.post(`${apiBaseUrl}/api/club/create-blog`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // only if you're using cookies (like with JWT auth)
    });
    
    setTitle("");
    setDescription("");
    setImage(null);
    setImages([]);
    navigate(`/club/home?tab=allBlogs`);
    toast.success("Blog posted successfully!");
    
  } catch (error) {
    console.error(error);
    toast.error("Failed to post blog");
  }
};
 

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
      <h2 className="text-2xl font-semibold text-center text-blue-700 dark:text-white mb-6">
        Add a New Blog
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Blog Title */}
        <div className="relative">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 transition"
          />
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            placeholder="Blog Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 transition"
            rows="6"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Upload Cover image 
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200 transition"
          />
        </div>

        {/* PDF/Word Upload */}
        <div>
  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
    Upload Any Related images
  </label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => setImages(Array.from(e.target.files))}
    className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0 file:text-sm file:font-semibold
      file:bg-blue-100 file:text-blue-700
      hover:file:bg-blue-200 transition"
  />
</div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;

// show live preview and styling 