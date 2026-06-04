import React, { useState } from "react";

const initialCategories = [
  { _id: "1", name: "Smartphones" },
  { _id: "2", name: "Laptops" },
  { _id: "3", name: "Accessories" },
];

function Category() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Create Category
  const handleCreate = () => {
    if (!newCategory.trim()) return;
    const newCat = { _id: Date.now().toString(), name: newCategory };
    setCategories([newCat, ...categories]);
    setNewCategory("");
  };

  // Delete Category
  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat._id !== id));
  };

  // Start Edit
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  // Update Category
  const handleUpdate = () => {
    setCategories(
      categories.map((cat) =>
        cat._id === editId ? { ...cat, name: editName } : cat
      )
    );
    setEditId(null);
    setEditName("");
  };

  

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Categories</h1>

      {/* Create Category */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New category name"
          className="p-2 rounded bg-gray-800 text-white flex-1"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            {editId === cat._id ? (
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
                <span className="text-orange-400 font-semibold">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white text-sm"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white text-sm"
                    onClick={() => handleDelete(cat._id)}
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

export default Category;