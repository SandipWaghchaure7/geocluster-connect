import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const ChatWindow = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket, joinGroup, leaveGroup, sendMessage, startTyping, stopTyping } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
    joinGroup(groupId);

    // Listen for new messages
    if (socket) {
      socket.on('receive_message', handleNewMessage);
      socket.on('user_typing', handleUserTyping);
      socket.on('user_stop_typing', handleUserStopTyping);
    }

    return () => {
      leaveGroup(groupId);
      if (socket) {
        socket.off('receive_message', handleNewMessage);
        socket.off('user_typing', handleUserTyping);
        socket.off('user_stop_typing', handleUserStopTyping);
      }
    };
  }, [groupId, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/messages/group/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Fetch messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (messageData) => {
    if (messageData.groupId === groupId) {
      setMessages(prev => [...prev, messageData.message]);
    }
  };

  const handleUserTyping = (data) => {
    if (data.groupId === groupId && data.userId !== user?.id) {
      setTyping(data.username);
    }
  };

  const handleUserStopTyping = (data) => {
    if (data.groupId === groupId) {
      setTyping(null);
    }
  };

  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://localhost:5000/api/messages/group/${groupId}`,
      { content: newMessage },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const messageData = {
      groupId,
      message: response.data.message
    };

    sendMessage(messageData);
    setNewMessage('');
    stopTyping(groupId, user?.id);
  } catch (error) {
    console.error('Send message error:', error);
  }
};

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // Start typing indicator
    if (!typingTimeoutRef.current) {
      startTyping(groupId, user?.id, user?.username);
    }

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current);

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(groupId, user?.id);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  // Debug logging
  console.log('Current user ID:', user?.id);
  if (messages.length > 0) {
    console.log('Sample message sender ID:', messages[0]?.sender?._id);
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            // Convert both IDs to strings for comparison
            const messageUserId = message.sender._id ? message.sender._id.toString() : '';
const currentUserId = localStorage.getItem('userId') || '';
const isMyMessage = messageUserId === currentUserId;

            console.log('Message from:', messageUserId, 'Current user:', currentUserId, 'Is mine:', isMyMessage);

            return (
              <div
                key={message._id}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isMyMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {!isMyMessage && (
                    <p className="text-xs font-semibold mb-1">
                      {message.sender.username}
                    </p>
                  )}
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typing && (
        <div className="px-4 py-2 text-sm text-gray-500 italic">
          {typing} is typing...
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;