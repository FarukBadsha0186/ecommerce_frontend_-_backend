import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Create Product", path: "/create-product", icon: "➕" },
    { name: "All Products", path: "/all-products", icon: "📦" },
    // { name: "All Reviews", path: "/all-reviews", icon: "⭐" },
    // { name: "Category", path: "/category", icon: "📂" },
    // { name: "Brand", path: "/brand", icon: "🏷️" },
    { name: "All Orders", path: "/all-orders", icon: "🧾" },
    { name: "File Manager", path: "/file-manager", icon: "📁" },
    { name: "Logout", path: "/logout", icon: "🚪" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">

      {/* Logo */}
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-400">
        Admin Panel
      </h2>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

    </div>
  );
}

export default Sidebar;