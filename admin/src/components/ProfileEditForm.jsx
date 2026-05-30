import { useState } from "react";

function ProfileEditForm() {
  const [formData, setFormData] = useState({
    name: "Faruk Badsha",
    email: "admin@gmail.com",
    phone: "+8801234567890",
    address: "Chattogram, Bangladesh",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);

    // 👉 এখানে API call হবে (future)
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Update Profile</h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>

      </form>
    </div>
  );
}

export default ProfileEditForm;