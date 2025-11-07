import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = "https://acm-club-project-backend.onrender.com";

import { toast } from "react-toastify";

const AddBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image || !category) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("coverimg", image);
    formData.append("section", category);
    images.forEach((img) => formData.append("photos", img));

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/students/create-blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setTitle("");
      setDescription("");
      setImage(null);
      setImages([]);
      setCategory("");
     // navigate(`/club/home?tab=allBlogs`);
      toast.success("Blog posted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post blog");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-semibold text-center text-blue-700 dark:text-white mb-6">
        Add a New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
        />

        {/* Description */}
        <textarea
          placeholder="Blog Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          rows="6"
        />

        {/* Category Dropdown */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Select Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          >
            //"Intern", "Academic Resources", "Tech Stacks", "Experience",
            <option value="">-- Choose Category --</option>
            <option value="Intern">Internship / Placement</option>
            <option value="Academic Resources">Academic Resources</option>
            <option value="Tech Stacks">Tech Stack</option>
            <option value="Experience">Experience</option>
          </select>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Upload Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
          />
        </div>

        {/* Additional Images */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Upload Additional Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300"
        >
          Submit Blog
        </button>
      </form>

      {/* Live Preview */}
      {(title || description || image) && (
        <div className="mt-10 p-6 border-2 border-dashed border-blue-300 rounded-lg bg-gray-50 dark:bg-gray-900">
          <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
            Live Preview
          </h3>
          <h4 className="text-2xl font-bold text-blue-700 mb-2 uppercase text-center">
            {title}
          </h4>
          {image && (
            <div className="flex justify-center mb-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Cover"
                className="max-h-64 rounded-lg shadow-md"
              />
            </div>
          )}
          <p className="text-md text-gray-700 dark:text-gray-200 text-center leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddBlog;
