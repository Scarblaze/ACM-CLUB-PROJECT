import React from "react";
import { Heart, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ClubCard = ({ club }) => {
  const navigate = useNavigate();

 
  const handleReadMore = (clubId) => {
	navigate(`/admin?tab=fullViewclub&id=${clubId}`);
  };
  return (
	<div
	  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden 
				 transform transition-transform duration-300 hover:scale-105 
				 hover:shadow-xl cursor-pointer flex flex-col"
	>
	  <img
		src={club.photo}
		alt="cover"
		className="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
	  />
	  <div className="p-4 flex flex-col flex-grow">
		<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
		  {club.name}
		</h3>
		<div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300 mb-4">
		  <div className="flex items-center gap-1">
			
		  </div>
		
		</div>
		<button
		   onClick={() => handleReadMore(club._id)}
		  className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
		>
		  Read
		</button>
	  </div>
	</div>
  );
};

export default ClubCard;
