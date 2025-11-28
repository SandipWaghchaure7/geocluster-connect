import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (data) => {
        // Check if user is not on the group page
        const currentPath = window.location.pathname;
        if (!currentPath.includes(`/groups/${data.groupId}`)) {
          const notification = {
            id: Date.now(),
            message: `New message in ${data.message.group?.name || 'a group'}`,
            groupId: data.groupId
          };
          
          setNotifications(prev => [...prev, notification]);

          // Auto remove after 5 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 5000);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [socket]);

  const handleNotificationClick = (groupId) => {
    navigate(`/groups/${groupId}`);
    setNotifications(prev => prev.filter(n => n.groupId !== groupId));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          onClick={() => handleNotificationClick(notif.groupId)}
          className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition animate-slide-in"
        >
          <p className="font-semibold">💬 {notif.message}</p>
          <p className="text-sm text-blue-100">Click to view</p>
        </div>
      ))}
    </div>
  );
};

export default Notification;