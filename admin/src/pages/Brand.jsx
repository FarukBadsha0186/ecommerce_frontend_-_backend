import React, { useState } from "react";

const initialBrands = [
  { _id: "1", name: "Apple" },
  { _id: "2", name: "Samsung" },
  { _id: "3", name: "Sony" },
];

function Brand() {
  const [brands, setBrands] = useState(initialBrands);
  const [newBrand, setNewBrand] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Create
  const handleCreate = () => {
    if (!newBrand.trim()) return;
    const newB = { _id: Date.now().toString(), name: newBrand };
    setBrands([newB, ...brands]);
    setNewBrand("");
  };

  // Delete
  const handleDelete = (id) => {
    setBrands(brands.filter((b) => b._id !== id));
  };

  // Start edit
  const handleEdit = (b) => {
    setEditId(b._id);
    setEditName(b.name);
  };

  // Update
  const handleUpdate = () => {
    setBrands(
      brands.map((b) => (b._id === editId ? { ...b, name: editName } : b))
    );
    setEditId(null);
    setEditName("");
  };
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

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Brands</h1>

      {/* Add Brand */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New brand name"
          className="p-2 rounded bg-gray-800 text-white flex-1"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* Brands List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div
            key={b._id}
            className="bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            {editId === b._id ? (
              <div className="flex gap-2">
                <input
                  className="p-2 rounded bg-gray-800 flex-1 text-white"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button
                  className="bg-blue-600 px-3 rounded hover:bg-blue-700"
                  onClick={handleUpdate}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-semibold">{b.name}</span>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white text-sm"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white text-sm"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Brand;