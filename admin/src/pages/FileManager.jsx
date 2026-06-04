import React, { useState } from "react";

const initialFiles = [
  { _id: "1", name: "product1.jpg", type: "image", size: "2MB" },
  { _id: "2", name: "product2.png", type: "image", size: "1.5MB" },
  { _id: "3", name: "manual.pdf", type: "pdf", size: "500KB" },
];

const useGuestCheck = () => {
  const isGuest = localStorage.getItem('isGuest') === 'true';
  const guestAlert = () => {
    if (isGuest) {
      alert('🔒 Demo Mode! This feature is for admin only!');
      return true;
    }
    return false;
  };
  return { isGuest, guestAlert };
};



function FileManager() {
  const [files, setFiles] = useState(initialFiles);

  const handleDelete = (id) => {
    setFiles(files.filter((f) => f._id !== id));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">File Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file._id}
            className="bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-orange-400">{file.name}</p>
              <p className="text-gray-400 text-sm">
                {file.type} - {file.size}
              </p>
            </div>
            <button
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white text-sm"
              onClick={() => handleDelete(file._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileManager;