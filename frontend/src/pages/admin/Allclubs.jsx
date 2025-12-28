import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Clubcard from "./Clubcard";


const Allclubs = ({clubs}) => {
 
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const blogsPerPage = 6;
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
      };
  
      handleResize(); // Initial check
      window.addEventListener("resize", handleResize);
  
      return () => window.removeEventListener("resize", handleResize);
    }, []);
 


  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = isMobile ? clubs : clubs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(clubs.length / blogsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-white mb-10">
        All pending  Clubs
      </h2>

      {clubs.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">No clubs found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map((club, i) => (
              <Clubcard key={i} club={club} />
            ))}
          </div>

          {/* Pagination only for non-mobile */}
          {!isMobile && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                ⬅️ Previous
              </button>
              <span className="font-semibold text-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Allclubs;
