import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import { AppContext } from "../context/AppContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [userActivity, setUserActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchUserActivity();
    // eslint-disable-next-line
  }, []);

  const fetchUserActivity = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/user-activity`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });

      if (data.success) {
        setUserActivity(data.activity || []);
      } else {
        toast.error(data.message || 'Failed to fetch user activity');
        if (data.message && data.message.toLowerCase().includes('access denied')) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch user activity');
      console.error('Error fetching user activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
    toast.success('Admin logged out');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5e6d3] to-[#e8d5c4] flex items-center justify-center">
        <div className="text-[#5a4a42] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    // Added pt-24 to push content below Navbar
    <div className="min-h-screen bg-gradient-to-br from-[#f5e6d3] to-[#e8d5c4] pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#5a4a42]">Admin Dashboard</h1>
              <p className="text-[#8b7355] mt-2">User Login Activity Monitor</p>
            </div>
            <button onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-[#5a4a42] to-[#8b7355] text-white rounded-full hover:from-[#4a3d37] hover:to-[#7a6b5a] transition-all duration-200">
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-[#5a4a42] mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-[#8b7355]">{userActivity.length}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-[#5a4a42] mb-2">Active Today</h3>
            <p className="text-3xl font-bold text-[#8b7355]">{userActivity.filter(user => user.lastLogin && new Date(user.lastLogin).toDateString() === new Date().toDateString()).length}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-[#5a4a42] mb-2">Verified Users</h3>
            <p className="text-3xl font-bold text-[#8b7355]">{userActivity.filter(user => user.isAccountVerified).length}</p>
          </div>
        </div>

        {/* User Activity Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-[#e7ddd6]">
            <h2 className="text-2xl font-semibold text-[#5a4a42]">User Login Activity</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f4f0]">
                <tr>
                  <th className="px-6 py-4 text-left text-[#5a4a42] font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-[#5a4a42] font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-[#5a4a42] font-semibold">Last Login</th>
                  <th className="px-6 py-4 text-left text-[#5a4a42] font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-[#5a4a42] font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {userActivity.map((user, index) => (
                  <tr key={user._id} className={`border-b border-[#e7ddd6] ${index % 2 === 0 ? 'bg-white/50' : 'bg-[#f8f4f0]/50'}`}>
                    <td className="px-6 py-4 text-[#5a4a42]">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#5a4a42] text-white rounded-full flex items-center justify-center font-semibold mr-3">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
                        <span className="font-medium">{user.name || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5a4a42]">{user.email}</td>
                    <td className="px-6 py-4 text-[#5a4a42]">{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isAccountVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.isAccountVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#5a4a42]">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {userActivity.length === 0 && (
            <div className="p-12 text-center text-[#8b7355]"><p className="text-lg">No user activity found</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
