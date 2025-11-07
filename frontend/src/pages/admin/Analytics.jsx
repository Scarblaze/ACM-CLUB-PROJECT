import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const apiBaseUrl = "https://acm-club-project-backend.onrender.com";

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    approvedClubs: 0,
    disapprovedClubs: 0,
    approvedBlogs: 0,
    pendingBlogs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/admin/analytics`, {
          withCredentials: true, // if using cookies for auth
        });
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        toast.error('Failed to load stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10 text-lg">Loading stats...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">📊 Admin Dashboard Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Students" count={stats.totalStudents} color="bg-blue-100" />
        <StatCard label="Approved Clubs" count={stats.approvedClubs} color="bg-green-100" />
        <StatCard label="Disapproved Clubs" count={stats.disapprovedClubs} color="bg-red-100" />
        <StatCard label="Approved Blogs" count={stats.approvedBlogs} color="bg-green-100" />
        <StatCard label="Pending Blogs" count={stats.pendingBlogs} color="bg-yellow-100" />
      </div>
    </div>
  );
};

const StatCard = ({ label, count, color }) => {
  return (
    <div className={`rounded-xl shadow-md p-6 ${color} flex flex-col items-center`}>
      <div className="text-xl font-medium">{label}</div>
      <div className="text-3xl font-bold mt-2">{count}</div>
    </div>
  );
};

export default AdminStats;
