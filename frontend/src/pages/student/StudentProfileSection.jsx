import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from "axios";
import AllBlogs from "./AllBlogs";
import StudentProfileEditsection from "./StudentProfileEditSection";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchstudentinfo = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/student/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw error;
  }
};

export const fetchallblogs = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/student/blogs`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [photo, setPhoto] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const tab = new URLSearchParams(location.search).get("tab")||"";

  const getLikedBlogs = (blogs, studentId) => {
    return blogs.filter((blog) =>
      blog.likes?.includes(studentId)
    );
  };

  const getPostedBlogs = (blogs, studentId) => {
    return blogs.filter((blog) =>
      blog.studentId === studentId
    );
  };

  useEffect(() => {
    const info = async () => {
      try {
        const studentData = await fetchstudentinfo();
        const blogData = await fetchallblogs();
        setStudent(studentData);
        setBlogs(blogData);
        setLoading(false);

        const storedPhoto = studentData.profilePic ;
        if (storedPhoto) setPhoto(storedPhoto);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    info();
  }, []);

  const renderTabContent = () => {
    if (tab === "likedBlogs") {
      const likedBlogs = getLikedBlogs(blogs, student._id);
      return <AllBlogs blogs={likedBlogs} />;
    }

    if (tab === "postedBlogs") {
      const postedBlogs = getPostedBlogs(blogs, student._id);
      return <AllBlogs blogs={postedBlogs} />;
    }

    if (tab === "ProfileEditSection") {
      return <StudentProfileEditsection student={student} />;
    }

    return (
      <div className="text-gray-500 text-lg">
        Select a blog tab from the profile panel to view your blogs.
      </div>
    );
  };

  if (loading) {
    return <p className="text-center text-xl font-semibold py-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-b md:border-b-0 md:border-r border-gray-200 shadow-md p-6 flex flex-col items-center">
        {/* Profile Info */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={photo || "/default-user.jpg"}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-400 shadow"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">{student.name}</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => navigate("?tab=ProfileEditSection")}
            className="cursor-pointer w-full bg-blue-800 hover:scale-105 transition-transform duration-300 text-white py-2 rounded-lg text-sm sm:text-base font-medium shadow"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("?tab=postedBlogs")}
            className="cursor-pointer w-full bg-purple-600 hover:scale-105 transition-transform duration-300 text-white py-2 rounded-lg text-sm sm:text-base font-medium shadow"
          >
            Posted Blogs
          </button>
          <button
            onClick={() => navigate("?tab=likedBlogs")}
            className="cursor-pointer w-full bg-pink-600 hover:scale-105 transition-transform duration-300 text-white py-2 rounded-lg text-sm sm:text-base font-medium shadow"
          >
            Liked Blogs
          </button>
          <button
            onClick={() => navigate("/student/home")}
            className="cursor-pointer underline text-blue-600 hover:text-blue-800 font-medium mt-2 text-sm sm:text-base"
          >
            Home
          </button>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-6rem)] md:max-h-full"
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Profile;