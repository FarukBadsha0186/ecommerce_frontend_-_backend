function ProfileStats() {
  const stats = [
    { title: "Total Products", value: 120 },
    { title: "Total Orders", value: 350 },
    { title: "Total Users", value: 80 },
    { title: "Revenue", value: "$5000" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-gray-800 p-4 rounded-xl text-center"
        >
          <p className="text-gray-400 text-sm">{item.title}</p>
          <h3 className="text-xl font-bold mt-1 text-green-400">
            {item.value}
          </h3>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;