import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import GroupList from './components/Groups/GroupList';
import CreateGroup from './components/Groups/CreateGroup';
import GroupDetail from './components/Groups/GroupDetail';
import LocationClustering from './components/Clustering/LocationClustering';
import InterestClustering from './components/Clustering/InterestClustering';
import ProfileSettings from './components/Dashboard/ProfileSettings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl font-bold text-gray-600">Loading...</div></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl font-bold text-gray-600">Loading...</div></div>;
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/groups/create" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
            <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><GroupList /></ProtectedRoute>} />
            <Route path="/clustering/location" element={<ProtectedRoute><LocationClustering /></ProtectedRoute>} />
            <Route path="/clustering/interest" element={<ProtectedRoute><InterestClustering /></ProtectedRoute>} />
            <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;