import Notification from '../Common/Notification';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/groups/my-groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Fetch groups error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
       <Notification />
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            GeoCluster Connect
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile/settings')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => navigate('/groups')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              My Groups
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {user?.profile?.firstName || user?.username}! 👋
          </h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 text-white rounded-lg shadow p-6">
            <h3 className="text-3xl font-bold mb-2">{groups.length}</h3>
            <p className="text-blue-100">Total Groups</p>
          </div>
          <div className="bg-green-500 text-white rounded-lg shadow p-6">
            <h3 className="text-3xl font-bold mb-2">
              {groups.filter(g => g.groupType === 'location').length}
            </h3>
            <p className="text-green-100">Location Groups</p>
          </div>
          <div className="bg-purple-500 text-white rounded-lg shadow p-6">
            <h3 className="text-3xl font-bold mb-2">
              {groups.filter(g => g.groupType === 'interest').length}
            </h3>
            <p className="text-purple-100">Interest Groups</p>
          </div>
        </div>

        {/* Feature Cards */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => navigate('/groups/create')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">
              Create Manual Group
            </h3>
            <p className="text-gray-600">
              Create and manage groups manually
            </p>
          </div>

          <div
            onClick={() => navigate('/clustering/location')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Location Clustering
            </h3>
            <p className="text-gray-600">
              Auto-form groups based on location
            </p>
          </div>

          <div
            onClick={() => navigate('/clustering/interest')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-purple-600 mb-2">
              Interest Clustering
            </h3>
            <p className="text-gray-600">
              Auto-form groups based on interests
            </p>
          </div>
        </div>

        {/* Recent Groups */}
        {!loading && groups.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Recent Groups</h3>
              <button
                onClick={() => navigate('/groups')}
                className="text-blue-500 hover:underline font-semibold"
              >
                View All →
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {groups.slice(0, 4).map((group) => (
                <div
                  key={group._id}
                  onClick={() => navigate(`/groups/${group._id}`)}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
                >
                  <h4 className="font-bold text-gray-800 mb-1">{group.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">👥 {group.members.length} members</span>
                    <span className={`px-2 py-1 rounded ${
                      group.groupType === 'manual' ? 'bg-blue-100 text-blue-800' :
                      group.groupType === 'location' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {group.groupType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Get Started with GeoCluster Connect!
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first group or try automatic clustering
            </p>
            <button
              onClick={() => navigate('/groups/create')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
            >
              Create Your First Group
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;