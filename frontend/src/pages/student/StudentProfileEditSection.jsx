
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const StudentProfileEditSection = ({ student }) => {
  const [editName, setEditName] = useState(student.name || "");
  const [editMode, setEditMode] = useState(false);
  const [photo, setPhoto] = useState(student.profilePic || "");
  const [preview, setPreview] = useState(student.profilePic || "");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔄 Update Name + Profile Picture
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName);
      if (photo && typeof photo !== "string") formData.append("profilePic", photo);

      const res = await axios.put(`${apiBaseUrl}/api/students/update-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Profile updated successfully!");
      setEditMode(false);
      if (res.data?.student?.profilePic) setPreview(res.data.student.profilePic);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // 📷 Handle Photo Select
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔐 Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match");

    try {
      await axios.put(
        `${apiBaseUrl}/api/students/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password updated!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setShowPasswordForm(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center"
      >
        My Profile
      </motion.h2>

      {/* Profile Picture */}
      <motion.div
        className="mb-8 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Profile Picture</p>
        <div className="relative group">
          <img
            src={preview || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 object-cover border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
            <button
              onClick={() => document.getElementById("profilePicInput").click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm"
            >
              Change Photo
            </button>
          </div>
        </div>
      </motion.div>

      {/* Name Edit Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Name</p>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Edit
            </button>
          )}
        </div>

        <AnimatePresence>
          {editMode ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <div className="flex space-x-3">
                <button onClick={handleProfileUpdate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Save
                </button>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-white">{editName}</p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Password Section */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Change Password
        </button>

        <AnimatePresence>
          {showPasswordForm && (
            <motion.form
              onSubmit={handlePasswordSubmit}
              className="mt-4 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
                required
              />
              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
                <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StudentProfileEditSection;
