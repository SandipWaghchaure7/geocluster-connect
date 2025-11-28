import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    latitude: '',
    longitude: '',
    address: '',
    interests: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        bio: user.profile?.bio || '',
        latitude: user.location?.coordinates?.[1] || '',
        longitude: user.location?.coordinates?.[0] || '',
        address: user.location?.address || '',
        interests: user.interests?.join(', ') || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      // Update profile
      await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        'http://localhost:5000/api/users/location',
        {
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
          address: formData.address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Location updated successfully!');
    } catch (error) {
      console.error('Update location error:', error);
      setMessage('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterests = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const interestsArray = formData.interests
        .split(',')
        .map(i => i.trim())
        .filter(i => i);

      await axios.put(
        'http://localhost:5000/api/users/interests',
        { interests: interestsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Interests updated successfully!');
    } catch (error) {
      console.error('Update interests error:', error);
      setMessage('Failed to update interests');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
          setMessage('Location detected! Click "Save Location" to update.');
        },
        (error) => {
          setMessage('Could not get your location. Please enter manually.');
        }
      );
    } else {
      setMessage('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-50 border-l-4 border-green-500 text-green-800'
              : 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            Save Profile
          </button>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Location</h2>
          
          <button
            onClick={getCurrentLocation}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            📍 Use Current Location
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 18.5204"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 73.8567"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Pune, Maharashtra"
            />
          </div>

          <button
            onClick={handleSaveLocation}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            Save Location
          </button>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⭐ Interests</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Interests (comma-separated)
            </label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., coding, music, sports, reading, travel"
            />
            <p className="text-sm text-gray-600 mt-2">
              Examples: programming, data science, AI, machine learning, web development, mobile apps, gaming, music, art, sports, fitness, cooking, travel, photography
            </p>
          </div>

          <button
            onClick={handleSaveInterests}
            disabled={loading}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
          >
            Save Interests
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;