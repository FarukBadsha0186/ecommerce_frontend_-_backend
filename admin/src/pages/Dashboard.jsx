import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([
    { title: "Total Users", value: 0, color: "text-blue-400", key: "totalUsers", icon: "👥" },
    { title: "Total Products", value: 0, color: "text-green-400", key: "totalProducts", icon: "📦" },
    { title: "Total Orders", value: 0, color: "text-purple-400", key: "totalOrders", icon: "📋" },
    { title: "Total Income", value: "$0", color: "text-yellow-400", key: "totalIncome", icon: "💰" },
    { title: "Pending Orders", value: 0, color: "text-orange-400", key: "pendingOrders", icon: "⏳" },
    { title: "Delivered Orders", value: 0, color: "text-green-500", key: "deliveredOrders", icon: "✅" },
    { title: "Cancelled Orders", value: 0, color: "text-red-400", key: "cancelledOrders", icon: "❌" },
    { title: "Total Reviews", value: 0, color: "text-pink-400", key: "totalReviews", icon: "⭐" },
    { title: "Total Categories", value: 0, color: "text-indigo-400", key: "totalCategories", icon: "📁" },
    { title: "Total Brands", value: 0, color: "text-teal-400", key: "totalBrands", icon: "🏷️" },
  ]);

  // useEffect(() => {
  //   const token = localStorage.getItem('adminToken');
  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }
  //   fetchDashboardStats();
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        navigate('/login');
        return;
    }
    
    // ✅ Guest হলে API call করবে না
    if (token === 'guest_demo') {
        setLoading(false);
        return;
    }
    
    fetchDashboardStats();
}, []);
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard stats...");
      const response = await api.get("/dashboard/stats");
      
      console.log("API Response:", response.data);
      
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        
        const summary = data.summary || {};
        const orderStatus = data.orderStatus || {};
        
        const totalOrders = (orderStatus.pending || 0) + 
                           (orderStatus.delivered || 0) + 
                           (orderStatus.cancelled || 0);
        
        setStats(prevStats => 
          prevStats.map(stat => {
            let value = 0;
            
            switch(stat.key) {
              case "totalUsers":
                value = summary.totalUsers || 0;
                break;
              case "totalProducts":
                value = summary.totalProducts || 0;
                break;
              case "totalOrders":
                value = totalOrders;
                break;
              case "totalIncome":
                value = `$${(summary.totalIncome || 0).toFixed(2)}`;
                break;
              case "pendingOrders":
                value = orderStatus.pending || 0;
                break;
              case "deliveredOrders":
                value = orderStatus.delivered || 0;
                break;
              case "cancelledOrders":
                value = orderStatus.cancelled || 0;
                break;
              case "totalCategories":
                value = summary.totalCategories || 0;
                break;
              case "totalBrands":
                value = summary.totalBrands || 0;
                break;
              case "totalReviews":
                value = data.totalReviews || 0;
                break;
              default:
                value = 0;
            }
            
            return {
              ...stat,
              value: value
            };
          })
        );
      } else {
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError("Dashboard API not found. Please check if the backend endpoint '/api/v1/dashboard/stats' exists.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (key) => {
    const navigationMap = {
      totalOrders: "/admin/orders",
      pendingOrders: "/admin/orders",
      deliveredOrders: "/admin/orders",
      cancelledOrders: "/admin/orders",
      totalProducts: "/all-products",
      totalUsers: "/profile",
      totalCategories: "/category",
      totalBrands: "/brand",
      totalReviews: "/all-reviews",
      totalIncome: null
    };
    
    const path = navigationMap[key];
    if (path) {
      navigate(path);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-gray-800 p-5 rounded-xl shadow animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <div className="bg-red-900/50 border border-red-500 rounded-xl p-6 text-center">
          <p className="text-red-400 mb-4">⚠️ {error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchDashboardStats}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition"
            >
              🚪 Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <button
          onClick={fetchDashboardStats}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 p-5 rounded-xl shadow hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() => handleCardClick(item.key)}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">{item.title}</p>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <h2 className={`text-2xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;