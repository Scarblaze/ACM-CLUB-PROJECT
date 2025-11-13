import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const ViewClub = ({ club }) => {
  const [logo, setLogo] = useState("/images/acm-logo.png");
  const [newName, setNewName] = useState("");
  const [edit, setedit] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axios.put(
        `${apiBaseUrl}/api/club/update-profile-photo`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success('Profile photo updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error?.response?.data?.message || 'Failed to update photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/club/update-description`,
        { description: newName },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Description updated successfully!');
      setNewName("");
      setedit(false);
    } catch (error) {
      console.error('Error updating description:', error);
      toast.error(error?.response?.data?.message || 'Failed to update description');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      await axios.put(
        `${apiBaseUrl}/api/club/change-password`,
        {
          currentPassword,
          newPassword
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      toast.success('Password updated successfully!');
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error?.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center"
      >
        ACM Coding Club
      </motion.h2>

      {/* Club Logo Section */}
      <motion.div 
        className="mb-8 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Club Logo</p>
        <div className="relative group">
          <img
            src={club.photo}
            alt="Club Logo"
            className="w-32 h-32 object-cover border-2 border-gray-300 dark:border-gray-600 rounded-full mb-3 shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <input
              id="logoInput"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById("logoInput").click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm"
            >
              Change Logo
            </button>
          </div>
        </div>
      </motion.div>

      {/* Club Description Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Club Description</p>
          {!edit && (
            <button
              onClick={() => {
                setNewName(club.description);
                setedit(true);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              Edit
            </button>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {edit ? (
            <motion.form
              onSubmit={handleSubmit}
              className="w-full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setedit(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.p 
              className="text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {club.description}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Change Password Section */}
      <motion.div 
        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="flex items-center justify-between w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <span>Change Password</span>
          <motion.span
            animate={{ rotate: showPasswordForm ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence>
          {showPasswordForm && (
            <motion.form
              onSubmit={handlePasswordSubmit}
              className="mt-4 space-y-4 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-1"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ViewClub;