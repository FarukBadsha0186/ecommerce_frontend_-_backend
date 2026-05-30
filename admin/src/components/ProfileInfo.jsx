function ProfileInfo() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <p className="text-gray-400">Full Name</p>
          <p className="font-semibold">Faruk Badsha</p>
        </div>

        <div>
          <p className="text-gray-400">Email</p>
          <p className="font-semibold">admin@gmail.com</p>
        </div>

        <div>
          <p className="text-gray-400">Phone</p>
          <p className="font-semibold">+880 1234-567890</p>
        </div>

        <div>
          <p className="text-gray-400">Address</p>
          <p className="font-semibold">Chattogram, Bangladesh</p>
        </div>

      </div>
    </div>
  );
}

export default ProfileInfo;