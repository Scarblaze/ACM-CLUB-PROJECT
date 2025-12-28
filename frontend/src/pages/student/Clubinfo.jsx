import React from "react";

const Clubinfo = ({ club }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
      {/* Club Name */}
      <h1 className="text-3xl font-bold uppercase text-center text-indigo-700 mb-4">
        {club.name}
      </h1>

      {/* Club Photo */}
      <div className="flex justify-center mb-6">
        <img
          src={club.photo || "/default-club.jpg"}
          alt={club.name}
          className="w-64 h-64 object-cover rounded-xl shadow-md"
        />
      </div>

      {/* Club Description */}
      <p className="text-lg text-gray-700 leading-relaxed text-center mb-8 px-4">
        {club.description || "No description provided."}
      </p>

      {/* Council Members */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Council Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {club.clubCouncil && club.clubCouncil.length > 0 ? (
            club.clubCouncil.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-100 p-4 rounded-xl shadow-sm"
              >
                <img
                  src={member.profilePic || "/default-user.jpg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-indigo-500"
                />
                <h3 className="text-lg font-bold text-indigo-700">
                  {member.name}
                </h3>
                <p className="text-sm italic text-gray-600">{member.role}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No council members available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clubinfo;