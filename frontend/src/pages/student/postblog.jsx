// src/components/StudentHome.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Search, CircleUserRound } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

// child components (unchanged)
import Clubinfo from "./Clubinfo";
import Postblog from "./postblog";
import FullBlogView from "./FullBlogcard";
import AllBlogs from "./AllBlogs";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// ---------- API helpers ----------
export const fetchAllClubs = async () => {
  const res = await axios.get(`${apiBaseUrl}/api/students/clubs`, { withCredentials: true });
  return res.data;
};
export const fetchstudentinfo = async () => {
  const res = await axios.get(`${apiBaseUrl}/api/students/me`, { withCredentials: true });
  return res.data;
};
export const fetchallblogs = async () => {
  const res = await axios.get(`${apiBaseUrl}/api/students/blogs`, { withCredentials: true });
  return res.data;
};

// ---------- Component ----------
const StudentHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [student, setStudent] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // restore theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) setDarkMode(saved === "dark");
    } catch (e) {
      // ignore
    }
  }, []);

  // apply/remove `dark` class on <html> and persist choice
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch (e) {}
  }, [darkMode]);

  // fetch initial data
  useEffect(() => {
    const getClubs = async () => {
      try {
        const clubData = await fetchAllClubs();
        const studentData = await fetchstudentinfo();
        const blogData = await fetchallblogs();
        setClubs(clubData);
        setStudent(studentData);
        setBlogs(blogData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setLoading(false);
      }
    };

    getClubs();
  }, []);

  // derive tab/id from URL
  const tab = new URLSearchParams(location.search).get("tab") || "allBlogs";
  const id = new URLSearchParams(location.search).get("id") || 12;

  const isBlogTab = [
    "allBlogs",
    "home",
    "clubblogs",
    "Experience",
    "Academic Resources",
    "Intern",
    "Tech Stacks",
  ].includes(tab);

  // close search input when leaving blog pages
  useEffect(() => {
    if (!isBlogTab) {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, [tab, isBlogTab]);

  // helpers for content
  const getClubById = (clubsArray, clubId) => clubsArray.find((c) => c._id === clubId);
  const getBlogById = (blogsArray, blogId) => blogsArray.find((b) => b._id === blogId);
  const filterBlogsByClub = (blogsArr, clubId) => blogsArr.filter((b) => b.clubId === clubId);
  const getSectionBlogs = (blogsArr, section) => blogsArr.filter((b) => b.section === section);

  const renderTabContent = () => {
    const filteredBlogs = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (tab === "clubinfo") {
      return <Clubinfo club={getClubById(clubs, id)} />;
    } else if (tab === "postblog") {
      return <Postblog />;
    } else if (tab === "clubblogs") {
      return <AllBlogs blogs={filterBlogsByClub(blogs, id)} />;
    } else if (tab === "fullcard") {
      return <FullBlogView blog={getBlogById(blogs, id)} student={student} />;
    } else if (["Experience", "Academic Resources", "Intern", "Tech Stacks"].includes(tab)) {
      return <AllBlogs blogs={getSectionBlogs(blogs, tab)} />;
    } else {
      return <AllBlogs blogs={filteredBlogs} />;
    }
  };

  const getProfilePicUrl = (profilePic) => {
    if (!profilePic) return null;
    if (/^https?:\/\//i.test(profilePic)) return profilePic;
    return `${apiBaseUrl}/${String(profilePic).replace(/^\/+/, "")}`;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar */}
      <div
        className={`fixed z-30 md:static top-0 left-0 h-full w-64 ${
          darkMode ? "bg-gray-800 text-white" : "bg-blue-900 text-white"
        } transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">Student Panel</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-4 text-sm">
          <div>
            <h3 className="text-lg font-semibold mb-2">Student Blogs</h3>
            <Link to="/student/home?tab=home" className="block px-3 py-2 rounded hover:bg-blue-700">
              Home
            </Link>
            <Link to="/student/home?tab=Intern" className="block px-3 py-2 rounded hover:bg-blue-700">
              Intern / Placement
            </Link>
            <Link to="/student/home?tab=Academic Resources" className="block px-3 py-2 rounded hover:bg-blue-700">
              Academic Resources
            </Link>
            <Link to="/student/home?tab=Tech Stacks" className="block px-3 py-2 rounded hover:bg-blue-700">
              Tech Stacks
            </Link>
            <Link to="/student/home?tab=Experience" className="block px-3 py-2 rounded hover:bg-blue-700">
              Experience
            </Link>

            <Link to="/student/home?tab=postblog" className="block px-3 py-2 rounded hover:bg-blue-700">
              Post New Blog
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Clubs</h3>
            {clubs.map((club) => (
              <div key={club._id} className="ml-2">
                <p className="font-medium uppercase">{club.name}</p>
                <Link to={`/student/home?tab=clubinfo&&id=${club._id}`} className="block ml-3 mt-1 px-2 py-1 rounded hover:bg-blue-700">
                  Club Info
                </Link>
                <Link to={`/student/home?tab=clubblogs&&id=${club._id}`} className="block ml-3 px-2 py-1 rounded hover:bg-blue-700">
                  Club Blogs
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className={`flex justify-between items-center shadow-md px-4 py-4 md:px-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>

          <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-blue-700"}`}>{student?.name || "Student"}</h2>

          <div className="flex items-center gap-4">
            {/* show search only on blog related pages */}
            {isBlogTab ? (
              isSearchOpen ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`px-2 py-1 rounded border ${darkMode ? "bg-gray-700 text-white" : ""}`}
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setIsSearchOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                  />
                </motion.div>
              ) : (
                <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setIsSearchOpen(true)}>
                  <Search className="w-5 h-5 cursor-pointer" />
                </button>
              )
            ) : null}

            {/* Navbar profile with robust URL handling and fallback */}
            <button onClick={() => navigate("/StudentProfileSection")} aria-label="Open profile">
              {(() => {
                const pic = student?.profilePic;
                const url = getProfilePicUrl(pic);
                if (url) {
                  return (
                    <img
                      src={url}
                      alt={student?.name || "Profile"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                    />
                  );
                } else {
                  return (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 border-2 border-gray-300 cursor-pointer">
                      <CircleUserRound className="w-6 h-6 text-gray-500" />
                    </div>
                  );
                }
              })()}
            </button>

            <button onClick={() => setDarkMode((d) => !d)} className="cursor-pointer" aria-label="Toggle theme">
              {darkMode ? <Sun /> : <Moon />}
            </button>

            <button onClick={() => navigate("/")} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
              Logout
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 overflow-y-auto flex-1">
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentHome;
