import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from '../Chat/ChatWindow';

const GroupDetail = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroup(response.data.group);
    } catch (error) {
      console.error('Fetch group error:', error);
      alert('Failed to load group');
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Group deleted successfully');
      navigate('/groups');
    } catch (error) {
      console.error('Delete group error:', error);
      alert('Failed to delete group');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading group...</div>;
  }

  if (!group) {
    return <div className="text-center py-8">Group not found</div>;
  }

  const isAdmin = group.admin._id === user?.id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{group.name}</h2>
            <p className="text-gray-600">{group.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/groups')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Back
            </button>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Group
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className={`px-3 py-1 rounded-full font-semibold ${
            group.groupType === 'manual' ? 'bg-blue-100 text-blue-800' :
            group.groupType === 'location' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {group.groupType.toUpperCase()}
          </span>
          <span>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Members ({group.members.length})
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {group.members.map((member) => (
            <div
              key={member._id}
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {member.username}
                  {member._id === group.admin._id && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">{member.email}</p>
                {member.profile?.firstName && (
                  <p className="text-sm text-gray-500">
                    {member.profile.firstName} {member.profile.lastName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section - UPDATED */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💬 Group Chat</h3>
        <ChatWindow groupId={id} />
      </div>
    </div>
  );
};

export default GroupDetail;