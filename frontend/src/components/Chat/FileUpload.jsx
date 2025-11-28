import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const FileUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      onFileSelect(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
      
      {!selectedFile ? (
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-blue-500"
        >
          <Upload size={20} />
          <span className="text-sm">Attach File</span>
        </label>
      ) : (
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
          {preview && (
            <img src={preview} alt="Preview" className="w-10 h-10 object-cover rounded" />
          )}
          <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
          <button
            onClick={clearFile}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;