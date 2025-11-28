import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';

const OnlineStatus = ({ userId }) => {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Request online status
      socket.emit('check_online', userId);
      
      // Listen for status updates
      socket.on('user_online_status', (data) => {
        if (data.userId === userId) {
          setIsOnline(data.isOnline);
        }
      });

      return () => {
        socket.off('user_online_status');
      };
    }
  }, [socket, userId]);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      <span className="text-sm text-gray-600">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default OnlineStatus;