import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CreateStudentBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [coverPreview, setCoverPreview] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Handle Cover Image Selection
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverImg(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Handle Multiple Photos Selection
  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !section || !coverImg) {
      toast.error("All fields including cover image are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("section", section);
    formData.append("coverimg", coverImg);

    photos.forEach((img) => formData.append("photos", img));

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/student/create-blog`,
        formData,
        {
        
          withCredentials: true,
        }
      );

      toast.success("Blog submitted for approval!");

      // Reset form
      setTitle("");
      setDescription("");
      setSection("");
      setCoverImg(null);
      setPhotos([]);
      setCoverPreview("");
      setPhotoPreviews([]);

      navigate("/student/home?tab=myBlogs");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-semibold text-center text-blue-600 dark:text-white mb-6">
        Create New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white"
        />

        {/* Description */}
        <textarea
          placeholder="Write your blog description..."
          value={description}
          rows="6"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white"
        />

        {/* Section */}
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select Section</option>
          <option value="Intern">Intern</option>
          <option value="Academic Resources">Academic Resources</option>
          <option value="Tech Stacks">Tech Stacks</option>
          <option value="Experience">Experience</option>
        </select>

        {/* Cover Image Upload */}
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Cover Image (Required)
          </label>

          <button
            type="button"
            onClick={() => document.getElementById("coverInput").click()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload Cover Image
          </button>

          <input
            id="coverInput"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />

          {/* Cover Preview */}
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="mt-3 h-40 w-full object-contain rounded-md"
            />
          )}
        </div>

        {/* Additional Photos */}
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Additional Images (Optional)
          </label>

          <button
            type="button"
            onClick={() => document.getElementById("photosInput").click()}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Upload More Images
          </button>

          <input
            id="photosInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotosChange}
            className="hidden"
          />

          {/* Image Previews */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            {photoPreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                className="h-24 w-full object-cover rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
        >
          Submit Blog
        </button>

      </form>
    </div>
  );
};

export default CreateStudentBlog;