import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ClubCouncil = ({ club }) => {
  /* ================= STATES ================= */
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const [activeImageId, setActiveImageId] = useState(null);
  const [previewImages, setPreviewImages] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  /* ADD MEMBER */
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState(null);

  /* ================= IMAGE HANDLERS ================= */

  const handleChooseImage = (memberId, file) => {
    if (!file) return;

    setPreviewImages((prev) => ({
      ...prev,
      [memberId]: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => ({
      ...prev,
      [memberId]: file,
    }));
  };

  const handleUploadImage = async (memberId) => {
    const file = selectedFiles[memberId];
    if (!file) return toast.warning("Please choose an image");

    const formData = new FormData();
    formData.append("profilepic", file);

    try {
      await axios.put(
        `${apiBaseUrl}/api/club/update-council-member-photo/${memberId}`,
        formData,
        { withCredentials: true }
      );

      toast.success("Photo updated");
      setActiveImageId(null);
      setPreviewImages({});
      setSelectedFiles({});
    } catch {
      toast.error("Photo upload failed");
    }
  };

  const cancelImageEdit = (memberId) => {
    setPreviewImages((prev) => {
      const copy = { ...prev };
      delete copy[memberId];
      return copy;
    });

    setSelectedFiles((prev) => {
      const copy = { ...prev };
      delete copy[memberId];
      return copy;
    });

    setActiveImageId(null);
  };

  /* ================= NAME EDIT ================= */

  const handleNameEdit = (id, name) => {
    setEditingId(id);
    setNewName(name);
    setActiveImageId(null);
  };

  const handleNameSave = async (memberId) => {
    if (!newName.trim()) return toast.warning("Name required");

    try {
      await axios.put(
        `${apiBaseUrl}/api/club/update-council-member/${memberId}`,
        { name: newName },
        { withCredentials: true }
      );

      toast.success("Name updated");
      setEditingId(null);
    } catch {
      toast.error("Name update failed");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (memberId) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      await axios.delete(
        `${apiBaseUrl}/api/club/delete-council-member/${memberId}`,
        { withCredentials: true }
      );

      toast.success("Member removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= ADD MEMBER ================= */

  const handleAddMember = async () => {
    if (!addName || !addRole || !addImage)
      return toast.warning("All fields required");

    const formData = new FormData();
    formData.append("name", addName);
    formData.append("role", addRole);
    formData.append("profilepic", addImage);

    try {
      await axios.post(`${apiBaseUrl}/api/club/add-council-member`, formData, {
        withCredentials: true,
      });

      toast.success("Council member added");
      setShowAddForm(false);
      setAddName("");
      setAddRole("");
      setAddImage(null);
      setAddPreview(null);
    } catch {
      toast.error("Add failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Meet Our Council
      </h2>

      {/* MEMBERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {club.clubCouncil.map((member) => (
          <div key={member._id} className="bg-white p-6 rounded-xl shadow-lg">
            {/* PHOTO */}
            <div className="w-32 mx-auto mb-4">
              <img
                src={previewImages[member._id] || member.profilepic}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />

              {activeImageId === member._id && (
                <div className="mt-3 space-y-2">
                  <input
                    type="file"
                    hidden
                    id={`photo-${member._id}`}
                    accept="image/*"
                    onChange={(e) =>
                      handleChooseImage(member._id, e.target.files[0])
                    }
                  />

                  {/* CHOOSE */}
                  <button
                    onClick={() =>
                      document
                        .getElementById(`photo-${member._id}`)
                        .click()
                    }
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    Choose
                  </button>

                  {/* SAVE + CANCEL */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUploadImage(member._id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => cancelImageEdit(member._id)}
                      className="flex-1 bg-gray-300 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NAME */}
            {editingId === member._id ? (
              <>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleNameSave(member._id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-300 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <h3 className="text-center font-semibold">{member.name}</h3>
            )}

            {/* ROLE */}
            <div className="text-center bg-blue-600 text-white rounded-full py-1 my-3">
              {member.role}
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNameEdit(member._id, member.name)}
                className="bg-blue-600 text-white py-2 rounded"
              >
                Edit Name
              </button>

              <button
                onClick={() => {
                  setActiveImageId(member._id);
                  setEditingId(null);
                }}
                className="bg-gray-200 py-2 rounded"
              >
                Edit Photo
              </button>

              <button
                onClick={() => handleDelete(member._id)}
                className="bg-red-600 text-white py-2 rounded col-span-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MEMBER */}
      <div className="mt-10 max-w-md mx-auto">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl"
          >
            Add New Council Member
          </button>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl shadow mt-4">
            <input
              placeholder="Full Name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-3"
            />

            <input
              placeholder="Role"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />

            {addPreview && (
              <img
                src={addPreview}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
            )}

            <input
              type="file"
              hidden
              id="add-photo"
              accept="image/*"
              onChange={(e) => {
                setAddImage(e.target.files[0]);
                setAddPreview(
                  URL.createObjectURL(e.target.files[0])
                );
              }}
            />

            <button
              onClick={() =>
                document.getElementById("add-photo").click()
              }
              className="w-full py-3 bg-blue-600 text-white rounded-lg mb-4"
            >
              Choose Photo
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleAddMember}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubCouncil;