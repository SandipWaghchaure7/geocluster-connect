import React, { useState } from 'react';
import axios from 'axios';

const GroupSettings = ({ group, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/groups/${group._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Group updated successfully!');
      onUpdate();
    } catch (error) {
      console.error('Update group error:', error);
      alert('Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Group Settings</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Group Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : 'Update Group'}
        </button>
      </form>
    </div>
  );
};

export default GroupSettings;