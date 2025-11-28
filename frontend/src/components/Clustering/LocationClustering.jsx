import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LocationClustering = () => {
  const [maxDistance, setMaxDistance] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleCluster = async () => {
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/cluster/location',
        { maxDistance: parseFloat(maxDistance) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
    } catch (error) {
      console.error('Clustering error:', error);
      setResult({
        success: false,
        message: error.response?.data?.message || 'Clustering failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Location-Based Clustering
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Card */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-2">
            📍 How Location Clustering Works
          </h2>
          <p className="text-blue-800">
            This feature automatically groups users who are physically close to each other.
            Perfect for organizing meetups, study groups, or local events!
          </p>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Configure Clustering
          </h3>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Maximum Distance (kilometers)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="10"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              Users within this distance will be grouped together
            </p>
          </div>

          <button
            onClick={handleCluster}
            disabled={loading}
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating Groups...' : '🚀 Create Location Groups'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Results</h3>

            {result.success ? (
              <div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                  <p className="text-green-800 font-semibold">
                    ✅ {result.message}
                  </p>
                </div>

                {result.groups && result.groups.length > 0 && (
                  <div className="space-y-4">
                    {result.groups.map((group) => (
                      <div
                        key={group._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <h4 className="font-bold text-lg text-gray-800 mb-2">
                          {group.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {group.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            👥 {group.members.length} members
                          </span>
                          <button
                            onClick={() => navigate(`/groups/${group._id}`)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                          >
                            View Group
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => navigate('/groups')}
                  className="mt-6 w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600"
                >
                  Go to My Groups
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-800">{result.message}</p>
                <p className="text-sm text-yellow-700 mt-2">
                  💡 Tip: Make sure users have set their locations in their profiles
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LocationClustering;