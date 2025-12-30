import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ViewClub = ({ club }) => {
  const [previewLogo, setPreviewLogo] = useState(club.photo);
  const [newName, setNewName] = useState("");
  const [edit, setedit] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  
  useEffect(() => {
    setPreviewLogo(club.photo);
  }, [club.photo]);

 
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // instant preview
    const previewUrl = URL.createObjectURL(file);
    setPreviewLogo(previewUrl);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.put(
        `${apiBaseUrl}/api/club/update-profile-photo`,
        formData,
        { withCredentials: true }
      );

      toast.success("Profile photo updated!");

      // replace preview with backend image
      if (res.data?.photo) {
        setPreviewLogo(res.data.photo);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update photo");
      setPreviewLogo(club.photo);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${apiBaseUrl}/api/club/update-description`,
        { description: newName },
        { withCredentials: true }
      );

      toast.success("Description updated!");
      setedit(false);
    } catch (err) {
      toast.error("Failed to update description");
    }
  };

  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await axios.put(
        `${apiBaseUrl}/api/club/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      toast.success("Password updated!");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {club.name} Profile
      </h2>

      {/* LOGO */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={previewLogo}
          alt="Club Logo"
          className="w-32 h-32 rounded-full object-cover border shadow mb-3"
        />

        <input
          id="logoInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />

        <button
          onClick={() => document.getElementById("logoInput").click()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Change Logo
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Club Description</h3>
          {!edit && (
            <button
              onClick={() => {
                setNewName(club.description);
                setedit(true);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>

        {edit ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-3 rounded border mb-3"
              rows="4"
            />
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setedit(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
            {club.description}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <button
        onClick={() => setShowPasswordForm(!showPasswordForm)}
        className="w-full bg-blue-600 text-white px-4 py-3 rounded"
      >
        Change Password
      </button>

      <AnimatePresence>
        {showPasswordForm && (
          <motion.form
            onSubmit={handlePasswordSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded border"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded border"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded border"
            />
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded">
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewClub;
