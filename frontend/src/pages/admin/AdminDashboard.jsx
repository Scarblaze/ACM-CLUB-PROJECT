
import React, { useEffect,useState } from "react";
import { Menu, X, ChevronDown, ChevronRight, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import AllBlogs from "./AllBlogs";
import Allclubs from "./Allclubs";
import FullBlogcard from "./FullBlogcard";
import axios from "axios";
import { toast } from "react-toastify";
import FullClubcard from "./FullClubcard";
import Analytics from "./Analytics";


const apiBaseUrl = "https://acm-club-project-backend.onrender.com";
export const fetchclubs = async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/admin/pending-clubs`, {
      withCredentials: true,
    });
    return res.data.clubs;
  } catch (err) {
    console.error("Error fetching clubs:", err);
 
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
  
  } 
};
const AdminHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapseMenu, setCollapseMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs,setblogs]=useState([]);
   const [loading, setLoading] = useState(true); 
 const [clubs,setclubs]=useState([]);
  const tab = new URLSearchParams(location.search).get("tab") || "allBlogs";
  const id = new URLSearchParams(location.search).get("id") || 12;
 
      useEffect(() => {
        const getinfo = async () => {
          try {
            const clubdata = await fetchclubs();
            setclubs(clubdata);
            const blogsdata=await fetchblogs();
            setblogs(blogsdata);
            setLoading(false);
           
          } catch (err) {
            console.error("Failed to load clubs:", err);
            setLoading(false);
          }
           };
           getinfo();

          },[]);
    
    
 
  const handlelogout = async () => {
  
    try {
      const res = await axios.get(`${apiBaseUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      toast.success("Logout succesfully");
      navigate("/");
    } catch (err) {
      console.error("Error in inside :", err);
      //toast.error("Failed to logout ");
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
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
        return  <AllBlogs blogs={blogs} />;

      case "pendingClubs":
        return  <Allclubs clubs={clubs} />;
      
      case "fullblogcard":
          const blog=getblogbyid(blogs,id);
         return <FullBlogcard blog={blog} />;
      case "fullViewclub":
           const club=getClubById(clubs,id);
          return <FullClubcard  club={club}/>;
      case "analytics":
            return < Analytics />;
    
      default:
        return <Analytics />;
    }
  };

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
            
          
            <Link
              to="/admin?tab=pendingBlogs"
              className="block px-3 py-2 rounded hover:bg-blue-700"
            >
               Pending Blogs
            </Link>
            <Link
              to="/admin?tab=pendingClubs"
              className="block px-3 py-2 rounded hover:bg-blue-700"
            >
               Pending Clubs
            </Link>
            <Link
              to="/admin?tab=analytics"
              className="block px-3 py-2 rounded hover:bg-blue-700"
            >
               Analytics
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

          <h2 className="text-xl font-semibold text-blue-700 dark:text-white">
            Hello  Admin 
          </h2>

          <div className="flex items-center gap-4">
           

            <button onClick={toggleTheme}>
              {darkMode ? <Sun /> : <Moon />}
            </button>

          
            <button
              onClick={handlelogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
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
          {/*<h2 className="text-2xl font-bold mb-4 capitalize">
            {tab.replace(/([A-Z])/g, " $1")}
          </h2>*/}
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;

