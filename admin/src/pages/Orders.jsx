// src/pages/Orders.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 20
  });
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [pagination.currentPage, filters.status, filters.search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      });
      
      const response = await api.get(`/admin/orders?${params}`);
      
      if (response.data.success) {
        setOrders(response.data.orders);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalOrders: response.data.pagination.totalOrders
        }));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change order status to ${newStatus}?`)) return;
    
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        alert(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      const response = await api.delete(`/admin/orders/${orderId}`);
      if (response.data.success) {
        alert("Order deleted successfully");
        fetchOrders();
        setSelectedOrders(prev => prev.filter(id => id !== orderId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) return;
    
    try {
      const response = await api.put("/admin/orders/bulk/status", {
        orderIds: selectedOrders,
        status: bulkStatus
      });
      
      if (response.data.success) {
        alert(response.data.message);
        setSelectedOrders([]);
        setShowBulkModal(false);
        setBulkStatus("");
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update orders");
    }
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.orderId));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400",
      processing: "bg-blue-500/20 text-blue-400",
      shipped: "bg-purple-500/20 text-purple-400",
      delivered: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400"
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        <div className="bg-gray-800 rounded-xl p-4 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <p className="text-gray-400 mt-1">Total Orders: {pagination.totalOrders}</p>
        </div>
        <button onClick={fetchOrders} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Order Status</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            >
              <option value="all">📋 All Orders</option>
              <option value="pending">🟡 Pending</option>
              <option value="processing">🔵 Processing</option>
              <option value="shipped">🟣 Shipped</option>
              <option value="delivered">🟢 Delivered</option>
              <option value="cancelled">🔴 Cancelled</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Search</label>
            <input
              type="text"
              placeholder="🔍 Search by Order ID, Customer Name, Email or Phone..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Bulk Update Button */}
      {selectedOrders.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            📦 Bulk Update ({selectedOrders.length} orders)
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input type="checkbox" onChange={toggleSelectAll} className="w-4 h-4" />
                </th>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.orderId)}
                        onChange={() => toggleSelectOrder(order.orderId)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-blue-400">
                        {order.orderId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="text-sm text-gray-400">{order.customer.email}</div>
                    </td>
                    <td className="px-4 py-3">{order.items.length} items</td>
                    <td className="px-4 py-3 font-bold">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-lg border ${getStatusColor(order.status)} focus:outline-none`}
                      >
                        <option value="pending">🟡 Pending</option>
                        <option value="processing">🔵 Processing</option>
                        <option value="shipped">🟣 Shipped</option>
                        <option value="delivered">🟢 Delivered</option>
                        <option value="cancelled">🔴 Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Update Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Bulk Update Orders</h2>
            <p className="text-gray-400 mb-4">
              Update status for <span className="text-white font-bold">{selectedOrders.length}</span> orders
            </p>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-4"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleBulkUpdate}
                disabled={!bulkStatus}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                Update Orders
              </button>
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;