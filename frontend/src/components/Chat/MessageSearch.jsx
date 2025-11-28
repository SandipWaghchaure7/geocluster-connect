import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const MessageSearch = ({ messages, onResultClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = messages.filter(msg =>
      msg.content.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(filtered);
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search messages..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No messages found
            </div>
          ) : (
            <div className="divide-y">
              {results.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => {
                    onResultClick(msg._id);
                    clearSearch();
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 transition"
                >
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {msg.sender.username}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {msg.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageSearch;