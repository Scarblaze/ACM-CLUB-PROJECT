import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!newEmail.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!newEmail.endsWith("@college.com")) {
      toast.error("Admin email must end with @college.com");
      return false;
    }

    if (!newPassword.trim()) {
      toast.error("Password is required");
      return false;
    }


    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/admin/reset-admin`,
        {
          newEmail,
          newPassword,
        },
        { withCredentials: true }
      );

      toast.success(res?.data?.message || "Admin updated successfully!");

      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update admin";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Edit Admin Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* New Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            New Admin Email
          </label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md 
            bg-white dark:bg-gray-700 dark:text-white 
            border-gray-300 dark:border-gray-600"
            placeholder="admin@college.com"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            New Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md 
              bg-white dark:bg-gray-700 dark:text-white 
              border-gray-300 dark:border-gray-600"
              placeholder="Enter new password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-2 text-sm text-gray-500 dark:text-gray-300"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Confirm New Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md 
            bg-white dark:bg-gray-700 dark:text-white 
            border-gray-300 dark:border-gray-600"
            placeholder="Confirm new password"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 
            text-white rounded-md disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => {
              setNewEmail("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="px-4 py-2 border rounded-md 
            text-gray-700 dark:text-gray-200 
            border-gray-300 dark:border-gray-600"
          >
            Reset
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileEdit;
