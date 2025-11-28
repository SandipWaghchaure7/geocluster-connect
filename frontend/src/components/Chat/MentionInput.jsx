import React, { useState, useRef, useEffect } from 'react';

const MentionInput = ({ value, onChange, members, onSend, placeholder }) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Detect @ symbol and show mention suggestions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const searchText = value.substring(lastAtIndex + 1);
      if (searchText && !searchText.includes(' ')) {
        setMentionSearch(searchText);
        const filtered = members.filter(m =>
          m.username.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredMembers(filtered);
        setShowMentions(filtered.length > 0);
      } else if (searchText === '') {
        setFilteredMembers(members);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  }, [value, members]);

  const handleMentionClick = (username) => {
    const lastAtIndex = value.lastIndexOf('@');
    const newValue = value.substring(0, lastAtIndex) + `@${username} `;
    onChange({ target: { value: newValue } });
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
      />

      {/* Mention Dropdown */}
      {showMentions && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
          {filteredMembers.map((member) => (
            <button
              key={member._id}
              onClick={() => handleMentionClick(member.username)}
              className="w-full p-3 text-left hover:bg-gray-100 transition flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{member.username}</p>
                {member.profile?.firstName && (
                  <p className="text-xs text-gray-500">
                    {member.profile.firstName} {member.profile.lastName}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;