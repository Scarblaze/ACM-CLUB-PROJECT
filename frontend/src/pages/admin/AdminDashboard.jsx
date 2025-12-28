import React, { useEffect, useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AllBlogs from "./AllBlogs";
import Allclubs from "./Allclubs";
import FullBlogcard from "./FullBlogcard";
import axios from "axios";
import { toast } from "react-toastify";
import FullClubcard from "./FullClubcard";
import Analytics from "./Analytics";
import ProfileEdit from "./ProfileEdit"; // <-- new import

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchclubs = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/admin/pending-clubs`, {
      withCredentials: true,
    });
    return res.data.clubs;
  } catch (err) {
    console.error("Error fetching clubs:", err);
    return [];
  }
};
export const fetchblogs = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/admin/pending-blogs`, {
      withCredentials: true,
    });
    return res.data.blogs;
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return [];
  }
};


export const fetchAdminInfo = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/admin/me`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Error fetching admin info:", err);
    return null;
  }
};

const AdminHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs, setblogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubs, setclubs] = useState([]);
  const [admin, setAdmin] = useState(null); // <-- admin state

  const tab = new URLSearchParams(location.search).get("tab") || "analytics";
  const id = new URLSearchParams(location.search).get("id") || 12;

  useEffect(() => {
    const getinfo = async () => {
      try {
        const [clubdata, blogsdata, adminData] = await Promise.all([
          fetchclubs(),
          fetchblogs(),
          fetchAdminInfo(),
        ]);
        setclubs(clubdata || []);
        setblogs(blogsdata || []);
        setAdmin(adminData || null);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setLoading(false);
      }
    };
    getinfo();
  }, []);

  const handlelogout = async () => {
    try {
      await axios.get(`${apiBaseUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      toast.success("Logout succesfully");
      navigate("/");
    } catch (err) {
      console.error("Error in logout:", err);
      toast.error("Failed to logout");
    }
  };

  const toggleTheme = () => {
    setDarkMode((d) => !d);
    // toggle html class so child components with `dark:` stay consistent
    document.documentElement.classList.toggle("dark");
  };

  const getClubById = (clubsArray, clubId) => {
    return clubsArray.find((club) => club._id === clubId);
  };
  const getblogbyid = (blogsArray, id) => {
    return blogsArray.find((blog) => blog._id === id);
  };

  const renderTabContent = () => {
    switch (tab) {
      case "pendingBlogs":
        return <AllBlogs blogs={blogs} />;
      case "pendingClubs":
        return <Allclubs clubs={clubs} />;
      case "fullblogcard": {
        const blog = getblogbyid(blogs, id);
        return <FullBlogcard blog={blog} />;
      }
      case "fullViewclub": {
        const club = getClubById(clubs, id);
        return <FullClubcard club={club} />;
      }
      case "analytics":
        return <Analytics />;
      case "profileedit": // <-- new case
        return <ProfileEdit user={admin} />;
      default:
        return <Analytics />;
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div
      className={`flex h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`fixed z-30 md:static top-0 left-0 h-full w-64 ${
          darkMode ? "bg-gray-800" : "bg-blue-900"
        } text-white transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="p-4 space-y-4 text-sm">
          <div>
            <Link to="/admin?tab=pendingBlogs" className="block px-3 py-2 rounded hover:bg-blue-700">
              Pending Blogs
            </Link>
            <Link to="/admin?tab=pendingClubs" className="block px-3 py-2 rounded hover:bg-blue-700">
              Pending Clubs
            </Link>
            <Link to="/admin?tab=analytics" className="block px-3 py-2 rounded hover:bg-blue-700">
              Analytics
            </Link>

            {/* NEW: Edit Profile link similar to Analytics */}
            <Link to="/admin?tab=profileedit" className="block px-3 py-2 rounded hover:bg-blue-700">
              Edit Profile
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div
          className={`flex justify-between items-center shadow-md px-4 py-4 md:px-6 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>

          <h2 className="text-xl font-semibold text-blue-700 dark:text-white">Hello Admin</h2>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme}>{darkMode ? <Sun /> : <Moon />}</button>

            <button onClick={handlelogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Logout
            </button>
          </div>
        </div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 overflow-y-auto flex-1"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;
