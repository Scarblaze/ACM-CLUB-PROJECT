import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, HeartOff } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const FullBlogView = ({ blog, student }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [likes, setLikes] = useState(blog?.likes || []);
  const [comments, setComments] = useState(blog?.comments || []);
  const [newComment, setNewComment] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const isLiked = student && likes.includes(student._id);

  const images = [blog.coverimg, ...blog.photos];
  const totalImages = images.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/student/like/${blog._id}`,
        {},
        { withCredentials: true }
      );
      if (isLiked) {
        setLikes(likes.filter((id) => id !== student._id));
      } else {
        setLikes([...likes, student._id]);
      }
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/student/comment/${blog._id}`,
        { comment: newComment },
        { withCredentials: true }
      );
      setComments([...comments, { student: student._id, comment: newComment }]);
      setNewComment("");
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  if (!blog) return <div className="p-6">Loading blog...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{blog.title}</h2>
        <button
          onClick={handleLike}
          className="flex items-center text-red-600 font-semibold text-lg gap-1"
        >
          {isLiked ? <Heart fill="red" className="text-red-600" /> : <Heart  className="text-red-600" />}
          {likes.length}
        </button>
      </div>

      {/* Image slider */}
      <div className="relative w-full h-80 rounded overflow-hidden">
        <img
          src={images[currentSlide]}
          alt="Blog Slide"
          className="w-full h-full object-contain rounded shadow-lg"
        />
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Description */}
      <div>
        <p className="text-gray-700 dark:text-gray-200">{blog.description}</p>
      </div>

      {/* Comments */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Comments:</h3>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c, idx) => (
                <li
                  key={idx}
                  className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow"
                >
                  <span className="font-medium">{idx + 1}</span> {c.comment}
                </li>
              ))}
            </ul>
          )}

        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded shadow"
            placeholder="Add a comment..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
             Post Comment
          </button>
        </div>

      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/student/home?tab=allBlogs")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ⬅️ Back to Blogs
      </button>
    </div>
  );
};

export default FullBlogView;