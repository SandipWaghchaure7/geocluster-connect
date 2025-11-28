const User = require('../models/User');
const Group = require('../models/Group');
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Location-based clustering
const clusterByLocation = async (req, res) => {
  try {
    const { maxDistance } = req.body;
    
    // Get all users with valid locations
    const users = await User.find({
      'location.coordinates.0': { $ne: 0 },
      'location.coordinates.1': { $ne: 0 }
    }).select('_id username email location');

    if (users.length < 2) {
      return res.status(400).json({
        message: 'Need at least 2 users with location data for clustering'
      });
    }

    // Format users for ML service
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      username: user.username,
      location: user.location
    }));

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/cluster/location`, {
      users: formattedUsers,
      max_distance: maxDistance || 1.0
    });

    const clusters = mlResponse.data.clusters;

    if (!clusters || clusters.length === 0) {
      return res.json({
        success: true,
        message: 'No clusters found',
        clusters: []
      });
    }

    // Create groups from clusters
    const createdGroups = [];
    
    for (const cluster of clusters) {
      const group = await Group.create({
        name: `Location Group ${cluster.cluster_id + 1}`,
        description: `Auto-generated group based on location proximity`,
        groupType: 'location',
        admin: req.user.id,
        members: cluster.member_ids,
        clusterInfo: {
          algorithm: 'DBSCAN',
          parameters: { maxDistance }
        }
      });

      // Add group to all members
      await User.updateMany(
        { _id: { $in: cluster.member_ids } },
        { $push: { groups: group._id } }
      );

      const populatedGroup = await Group.findById(group._id)
        .populate('admin', 'username')
        .populate('members', 'username email');

      createdGroups.push(populatedGroup);
    }

    res.json({
      success: true,
      message: `Created ${createdGroups.length} location-based groups`,
      groups: createdGroups
    });

  } catch (error) {
    console.error('Location clustering error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Interest-based clustering
const clusterByInterest = async (req, res) => {
  try {
    const { nClusters } = req.body;
    
    // Get all users with interests
    const users = await User.find({
      interests: { $exists: true, $ne: [] }
    }).select('_id username email interests');

    if (users.length < 2) {
      return res.status(400).json({
        message: 'Need at least 2 users with interests for clustering'
      });
    }

    // Format users for ML service
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      username: user.username,
      interests: user.interests
    }));

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/cluster/interest`, {
      users: formattedUsers,
      n_clusters: nClusters || 3
    });

    const clusters = mlResponse.data.clusters;

    if (!clusters || clusters.length === 0) {
      return res.json({
        success: true,
        message: 'No clusters found',
        clusters: []
      });
    }

    // Create groups from clusters
    const createdGroups = [];
    
    for (const cluster of clusters) {
      const group = await Group.create({
        name: `Interest Group ${cluster.cluster_id + 1}`,
        description: `Auto-generated group based on shared interests`,
        groupType: 'interest',
        admin: req.user.id,
        members: cluster.member_ids,
        clusterInfo: {
          algorithm: 'K-Means',
          parameters: { nClusters }
        }
      });

      // Add group to all members
      await User.updateMany(
        { _id: { $in: cluster.member_ids } },
        { $push: { groups: group._id } }
      );

      const populatedGroup = await Group.findById(group._id)
        .populate('admin', 'username')
        .populate('members', 'username email');

      createdGroups.push(populatedGroup);
    }

    res.json({
      success: true,
      message: `Created ${createdGroups.length} interest-based groups`,
      groups: createdGroups
    });

  } catch (error) {
    console.error('Interest clustering error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  clusterByLocation,
  clusterByInterest
};