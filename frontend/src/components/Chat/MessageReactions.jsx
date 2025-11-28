import React, { useState } from 'react';

const MessageReactions = ({ messageId, reactions = [], onReact }) => {
  const [showPicker, setShowPicker] = useState(false);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  const handleReact = (emoji) => {
    onReact(messageId, emoji);
    setShowPicker(false);
  };

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="relative">
      {/* Reaction counts */}
      {Object.keys(reactionCounts).length > 0 && (
        <div className="flex gap-1 mb-1">
          {Object.entries(reactionCounts).map(([emoji, count]) => (
            <span
              key={emoji}
              className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"
            >
              {emoji} {count}
            </span>
          ))}
        </div>
      )}

      {/* React button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        React
      </button>

      {/* Emoji picker */}
      {showPicker && (
        <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded-lg p-2 flex gap-2 z-10">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="text-2xl hover:scale-125 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReactions;