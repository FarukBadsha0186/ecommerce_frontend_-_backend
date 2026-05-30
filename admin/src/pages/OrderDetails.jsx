// src/pages/OrderDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || "Failed to fetch order details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Change order status to ${newStatus}?`)) return;
    
    setUpdating(true);
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: statusNote
      });
      
      if (response.data.success) {
        setOrder(response.data.order);
        setStatusNote("");
        showMessage("Order status updated successfully!", "success");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    
    try {
      const response = await api.delete(`/admin/orders/${orderId}`);
      if (response.data.success) {
        showMessage("Order deleted successfully", "success");
        setTimeout(() => navigate('/admin/orders'), 1500);
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to delete order", "error");
    }
  };

  const showMessage = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handlePrintInvoice = () => {
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; margin: 0; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #333; padding-left: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; }
            .total-table { width: 300px; float: right; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Customer Information</div>
            <p>
              <strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}<br>
              <strong>Email:</strong> ${order.customer.email}<br>
              <strong>Phone:</strong> ${order.customer.phone}<br>
              <strong>Address:</strong> ${order.customer.address}<br>
              <strong>City:</strong> ${order.customer.city}<br>
              <strong>Zip Code:</strong> ${order.customer.zipCode}
            </p>
          </div>
          
          <div class="section">
            <div class="section-title">Payment Information</div>
            <p>
              <strong>Method:</strong> ${order.paymentMethod.toUpperCase()}<br>
              <strong>Status:</strong> ${order.paymentStatus || 'pending'}<br>
              ${order.transactionId ? `<strong>Transaction ID:</strong> ${order.transactionId}<br>` : ''}
              ${order.paymentDate ? `<strong>Payment Date:</strong> ${new Date(order.paymentDate).toLocaleString()}<br>` : ''}
            </p>
          </div>
          
          <div class="section">
            <div class="section-title">Order Items</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>
                      ${item.product_name}
                      ${item.colour ? `<br><small>Color: ${item.colour}</small>` : ''}
                      ${item.size ? `<br><small>Size: ${item.size}</small>` : ''}
                    </td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              <table class="total-table">
                <tr><td>Subtotal:</td><td>$${order.subtotal.toFixed(2)}</td></tr>
                <tr><td>Shipping:</td><td>$${order.shipping.toFixed(2)}</td></tr>
                <tr><td>Tax:</td><td>$${order.tax.toFixed(2)}</td></tr>
                <tr style="font-weight: bold; font-size: 18px;">
                  <td>Total:</td>
                  <td>$${order.total.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer generated invoice. No signature required.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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

  const getPaymentStatusColor = (status) => {
    if (status === 'paid') return "bg-green-500/20 text-green-400";
    if (status === 'failed') return "bg-red-500/20 text-red-400";
    return "bg-yellow-500/20 text-yellow-400";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-32 bg-gray-700 rounded mt-4"></div>
            <div className="h-32 bg-gray-700 rounded mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="bg-red-900/50 border border-red-500 rounded-xl p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error || "Order not found"}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchOrderDetails}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              ← Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-gray-400 hover:text-white mb-2 inline-flex items-center gap-2"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
          <p className="text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrintInvoice}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition flex items-center gap-2"
          >
            🖨️ Print Invoice
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
          >
            🗑️ Delete Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📦 Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left py-3">Product</th>
                    <th className="text-left py-3">Quantity</th>
                    <th className="text-left py-3">Price</th>
                    <th className="text-left py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-3">
                        <div className="font-medium">{item.product_name}</div>
                        {item.colour && (
                          <div className="text-sm text-gray-400 mt-1">
                            🎨 Color: {item.colour}
                          </div>
                        )}
                        {item.size && (
                          <div className="text-sm text-gray-400">
                            📏 Size: {item.size}
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="text-lg font-semibold">{item.quantity}</span>
                      </td>
                      <td className="py-3">${item.price.toFixed(2)}</td>
                      <td className="py-3 font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-gray-700 mt-4">
                  <tr className="text-sm">
                    <td colSpan="3" className="text-right py-2 text-gray-400">
                      Subtotal:
                    </td>
                    <td className="py-2">${order.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="text-sm">
                    <td colSpan="3" className="text-right py-2 text-gray-400">
                      Shipping:
                    </td>
                    <td className="py-2">${order.shipping.toFixed(2)}</td>
                  </tr>
                  <tr className="text-sm">
                    <td colSpan="3" className="text-right py-2 text-gray-400">
                      Tax:
                    </td>
                    <td className="py-2">${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr className="text-lg font-bold">
                    <td colSpan="3" className="text-right py-3 text-gray-400">
                      Total:
                    </td>
                    <td className="py-3 text-green-400">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              💳 Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Payment Method</p>
                <p className="font-medium text-lg mt-1">
                  {order.paymentMethod.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Payment Status</p>
                <p className={`font-medium text-lg mt-1 ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus === 'paid' ? '✅ Paid' : 
                   order.paymentStatus === 'failed' ? '❌ Failed' : 
                   '⏳ Pending'}
                </p>
              </div>
              {order.transactionId && (
                <>
                  <div>
                    <p className="text-gray-400 text-sm">Transaction ID</p>
                    <p className="font-mono text-sm mt-1">{order.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Date</p>
                    <p className="mt-1">
                      {order.paymentDate ? new Date(order.paymentDate).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🔄 Update Status
            </h2>
            <div className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${getStatusColor(order.status)}`}>
              Current: {order.status.toUpperCase()}
            </div>
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
            >
              <option value="pending">🟡 Pending</option>
              <option value="processing">🔵 Processing</option>
              <option value="shipped">🟣 Shipped</option>
              <option value="delivered">🟢 Delivered</option>
              <option value="cancelled">🔴 Cancelled</option>
            </select>
            <textarea
              placeholder="Add a note (optional)..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
              rows="3"
            />
            {updating && (
              <p className="text-blue-400 text-sm text-center">Updating...</p>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              👤 Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Full Name</p>
                <p className="font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Address</p>
                <p className="font-medium">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone Number</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Delivery Address</p>
                <p className="font-medium">
                  {order.customer.address}<br/>
                  {order.customer.city}, {order.customer.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⏰ Order Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Created:</span>
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-sm">
                  {new Date(order.updatedAt).toLocaleString()}
                </span>
              </div>
              {order.statusNote && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Status Note:</p>
                  <p className="text-sm italic">{order.statusNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2">Delete Order</h2>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete order <span className="text-white font-bold">{order.orderId}</span>?
              </p>
              <p className="text-red-400 text-sm mb-6">
                This action cannot be undone!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteOrder}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;