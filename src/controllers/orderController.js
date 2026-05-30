// backend/src/controllers/orderController.js
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const cardModel = require('../models/cardModel');
const userModel = require('../models/userModel');

// ============== USER CONTROLLERS ==============

exports.createOrder = async (req, res) => {
  try {
    let user_id = req.user_id || req.user?._id || req.headers._id;
    
    console.log('=== CREATE ORDER ===');
    console.log('User ID:', user_id);
    
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    
    const { items, customer, paymentMethod, subtotal, shipping, tax, total, notes } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order"
      });
    }
    
    // Check stock for each item
    for (const item of items) {
      const product = await productModel.findById(item.product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product_id} not found`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title || product.name}. Available: ${product.stock}`
        });
      }
    }
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create order
    const orderData = {
      orderId: orderId,
      user_id: user_id,
      items: items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        colour: item.colour || '',
        size: item.size || ''
      })),
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zipCode
      },
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax || 0,
      total: total,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date()
    };
    
    const order = await orderModel.create(orderData);
    
    // Update stock for each item
    for (const item of items) {
      await productModel.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // Clear cart after order
    await cardModel.deleteMany({ user_id: user_id });
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: orderId,
      order: order
    });
    
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log(`Searching for order with ID: ${orderId}`); // ডিবাগিং এর জন্য
    
    const order = await orderModel.findOne({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with ID: ${orderId}`
      });
    }
    
    res.status(200).json({
      success: true,
      order: order
    });
    
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.user_id || req.user?._id || req.headers._id;
    
    const orders = await orderModel.find({ user_id: user_id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders: orders,
      total: orders.length
    });
    
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;
    
    let filter = {};
    
    // Filter by status
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Search by order ID or customer name/email
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await orderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await orderModel.countDocuments(filter);
    
    // Get user details for each order
    const ordersWithUser = await Promise.all(orders.map(async (order) => {
      let user = null;
      if (order.user_id && order.user_id !== 'guest') {
        try {
          user = await userModel.findById(order.user_id).select('email');
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
      return {
        ...order.toObject(),
        user: user
      };
    }));
    
    res.status(200).json({
      success: true,
      orders: ordersWithUser,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders: totalOrders,
        limit: limit
      }
    });
    
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (enhanced with stock management)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await orderModel.findOne({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    // If order is cancelled, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await productModel.findByIdAndUpdate(item.product_id, {
          $inc: { stock: item.quantity }
        });
      }
    }
    
    // If order was cancelled and now being restored, reduce stock again
    if (order.status === 'cancelled' && status !== 'cancelled') {
      for (const item of order.items) {
        await productModel.findByIdAndUpdate(item.product_id, {
          $inc: { stock: -item.quantity }
        });
      }
    }
    
    order.status = status;
    order.updatedAt = new Date();
    
    if (note) {
      order.statusNote = note;
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: order
    });
    
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await orderModel.findOne({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    // Restore stock if order is not cancelled
    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        await productModel.findByIdAndUpdate(item.product_id, {
          $inc: { stock: item.quantity }
        });
      }
    }
    
    await orderModel.findOneAndDelete({ orderId: orderId });
    
    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
    
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const orders = await orderModel.find({ status: status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await orderModel.countDocuments({ status: status });
    
    res.status(200).json({
      success: true,
      orders: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders: totalOrders,
        limit: limit
      }
    });
    
  } catch (error) {
    console.error("Get orders by status error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk update order status
exports.bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds, status } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide order IDs array"
      });
    }
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const result = await orderModel.updateMany(
      { orderId: { $in: orderIds } },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} orders updated to ${status}`,
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get order statistics for dashboard
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const pendingOrders = await orderModel.countDocuments({ status: 'pending' });
    const processingOrders = await orderModel.countDocuments({ status: 'processing' });
    const shippedOrders = await orderModel.countDocuments({ status: 'shipped' });
    const deliveredOrders = await orderModel.countDocuments({ status: 'delivered' });
    const cancelledOrders = await orderModel.countDocuments({ status: 'cancelled' });
    
    // Total revenue
    const revenue = await orderModel.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await orderModel.countDocuments({
      createdAt: { $gte: today }
    });
    
    // This month's revenue
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = await orderModel.aggregate([
      { 
        $match: { 
          status: { $in: ['delivered', 'shipped'] },
          createdAt: { $gte: firstDayOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        todayOrders,
        totalRevenue: revenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
    
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const user_id = req.user_id || req.user?._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    
    let filter = { user_id: user_id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const orders = await orderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await orderModel.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      orders: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders: totalOrders,
        limit: limit
      }
    });
    
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order details for user
exports.getMyOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user_id = req.user_id || req.user?._id;
    
    const order = await orderModel.findOne({ orderId: orderId, user_id: user_id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.status(200).json({
      success: true,
      order: order
    });
    
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order by user
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user_id = req.user_id || req.user?._id;
    
    const order = await orderModel.findOne({ orderId: orderId, user_id: user_id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled"
      });
    }
    
    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();
    
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: order
    });
    
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Track order
exports.trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user_id = req.user_id || req.user?._id;
    
    const order = await orderModel.findOne({ orderId: orderId, user_id: user_id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    const trackingInfo = {
      orderId: order.orderId,
      status: order.status,
      estimatedDelivery: getEstimatedDelivery(order.status, order.createdAt),
      timeline: getOrderTimeline(order),
      currentLocation: getCurrentLocation(order.status)
    };
    
    res.status(200).json({
      success: true,
      tracking: trackingInfo
    });
    
  } catch (error) {
    console.error("Track order error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions
function getEstimatedDelivery(status, createdAt) {
  if (status === 'delivered') return 'Delivered';
  if (status === 'cancelled') return 'Cancelled';
  
  const deliveryDate = new Date(createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  return deliveryDate.toLocaleDateString();
}

function getOrderTimeline(order) {
  const timeline = [
    { status: 'Order Placed', date: order.createdAt, completed: true }
  ];
  
  if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
    timeline.push({ status: 'Processing', date: order.updatedAt, completed: true });
  }
  
  if (order.status === 'shipped' || order.status === 'delivered') {
    timeline.push({ status: 'Shipped', date: order.updatedAt, completed: true });
  }
  
  if (order.status === 'delivered') {
    timeline.push({ status: 'Delivered', date: order.updatedAt, completed: true });
  }
  
  return timeline;
}

function getCurrentLocation(status) {
  const locations = {
    pending: 'Order received, waiting for processing',
    processing: 'Order is being processed',
    shipped: 'Order has been shipped',
    delivered: 'Order has been delivered',
    cancelled: 'Order has been cancelled'
  };
  return locations[status] || 'Processing';
}