
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const FullBlogView = ({blog}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

 
   
  if (!blog) return <div className="p-6">Loading blog...</div>;
  const handleApprove=async (blogId)=>{
	try {
		const res = await axios.put(
		  `${apiBaseUrl}/api/admin/approve-blog/${blogId}`,
		  {}, // since it's a PUT without body
		  { withCredentials: true } // for cookies/JWT session
		);
	
		if (res.data.success) {
		  toast.success("Blog approved successfully!");
		  // Optionally update the UI here (e.g., refetch blog list or mark as approved)
		} else {
		  toast.error(res.data.message || "Failed to approve blog");
		}
	  } catch (err) {
		console.error("Approve blog error:", err);
		toast.error("Something went wrong while approving the blog");
	  }
	  navigate('/admin?tab=home');
  };
  const handlereject=async (blogId)=>{
	try {
		const res = await axios.put(
		  `${apiBaseUrl}/api/admin/reject-blog/${blogId}`,
		  {}, // since it's a PUT without body
		  { withCredentials: true } // for cookies/JWT session
		);
	
		if (res.data.success) {
		  toast.success("Blog rejected successfully!");
		  // Optionally update the UI here (e.g., refetch blog list or mark as approved)
		} else {
		  toast.error(res.data.message || "Failed to reject blog");
		}
	  } catch (err) {
		console.error("Reject blog error:", err);
		toast.error("Something went wrong while rejecting the blog");
	  }
	  navigate('/admin?tab=home');
  };
  const images = [blog.coverimg, ...blog.photos];
  const totalImages = images.length;

  const nextSlide = () => {
	setCurrentSlide((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
	setCurrentSlide((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
	<div className="max-w-4xl mx-auto p-4 space-y-6">
	  {/* Header */}
	  <div className="flex justify-between items-center">
		<h2 className="text-3xl font-bold">{blog.title}</h2>
		
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
		<h3 className="text-xl font-semibold mb-2">Description:</h3>
		<p className="text-gray-700 dark:text-gray-200">{blog.description}</p>
		<h3 className="text-xl font-semibold mb-2">section:</h3>
        <p className="text-gray-700 dark:text-gray-200">{blog.section}</p>
	  </div>
          {/* approval*/ }
		  {blog.status==="pending"&&(
				<button
		   onClick={() => handleApprove(blog._id)}
		  className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
		     Approve
	     	</button>
			)
		  }
		   {blog.status==="pending"&&(
				<button
		   onClick={() => handlereject(blog._id)}
		  className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
		      Reject
	     	</button>
			)
		  }
	 
	 
       
	  {/* Back button */}
	  <button
		onClick={() => navigate("/admin?tab=pendingBlogs")}
		className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
	  >
		⬅️ Back to Blogs
	  </button>
	</div>
  );
};

export default FullBlogView;
