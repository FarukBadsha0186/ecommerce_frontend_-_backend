function ProfileCard() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow text-center">
      <img
        src="https://i.pravatar.cc/150"
        alt="Admin"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-bold">Super Admin</h2>
      <p className="text-gray-400">admin@gmail.com</p>
      <p className="text-sm text-blue-400 mt-2">Role: Super Admin</p>
    </div>
  );
}

export default ProfileCard;