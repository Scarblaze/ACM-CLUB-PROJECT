import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const apiBaseUrl = "https://acm-club-project-backend.onrender.com";
const ClubCouncil = ({ club }) => {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [activeImageId, setActiveImageId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  const handleAddMember = async () => {
    if (!newName || !newRole || !newImage) {
      toast.warning("Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newName);
    formData.append("profilepic", newImage);
    formData.append("role", newRole);
    
    try {
      await axios.post(
        `${apiBaseUrl}/api/club/add-council-member`,
        formData,
        { withCredentials: true }
      );

      toast.success("Council member added successfully!");
      setNewRole("");
      setNewName("");
      setNewImage(null);
      setIsAddingMember(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    }
  };

  const handleNameEdit = (memberId, currentName) => {
    setEditingId(memberId);
    setNewName(currentName);
    setActiveImageId(null);
  };

  const handleImageEdit = (memberId) => {
    setActiveImageId(memberId);
    setEditingId(null);
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    
    try {
      await axios.delete(
        `${apiBaseUrl}/api/club/delete-council-member/${memberId}`,
        { withCredentials: true }
      );
      toast.success("Council member deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (memberId) => {
    if (!newName.trim()) {
      toast.warning("Name cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("name", newName);
    if (newImage) formData.append("profilepic", newImage);

    try {
      await axios.put(
        `${apiBaseUrl}/api/club/update-council-member/${memberId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully!");
      setEditingId(null);
      setActiveImageId(null);
      setNewImage(null);
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">
        Meet Our Dynamic Council
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
        {club.clubCouncil.map((member, i) => (
          <div
            key={i}
            className="relative bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            {/* Member Image */}
            <div className="relative mx-auto w-32 h-32 mb-4">
              <img
                src={member.profilepic}
                alt={member.name}
                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-md group-hover:border-blue-400 transition-colors duration-300"
              />
              {activeImageId === member._id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center p-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-white text-xs mt-1 text-center">Click to upload</span>
                </div>
              )}
            </div>

            {/* Member Name */}
            {editingId === member._id ? (
              <div className="mb-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleSubmit(member._id)}
                    className="flex-1 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-1">
                {member.name}
              </h3>
            )}

            {/* Member Role - Centered below name */}
            <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium mb-4 mx-auto block w-fit">
              {member.role}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNameEdit(member._id, member.name)}
                className="py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleImageEdit(member._id)}
                className={`py-2 rounded-lg transition flex items-center justify-center space-x-1 ${
                  activeImageId === member._id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Photo</span>
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition col-span-2 flex items-center justify-center space-x-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Member Section */}
      <div className="max-w-2xl mx-auto">
        {!isAddingMember ? (
          <button
            onClick={() => setIsAddingMember(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add New Council Member</span>
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
              Add New Member
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., President, Design Head"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Member's full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="newImageInput"
                      accept="image/*"
                      onChange={(e) => setNewImage(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                      <span className="text-gray-700 dark:text-gray-300 truncate">
                        {newImage ? newImage.name : "Choose a photo..."}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleAddMember}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  Add Member
                </button>
                <button
                  onClick={() => {
                    setIsAddingMember(false);
                    setNewName("");
                    setNewRole("");
                    setNewImage(null);
                  }}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubCouncil;