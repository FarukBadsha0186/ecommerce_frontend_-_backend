// controllers/dashboardController.js
const brandModel = require("../models/brandModel.js");
const categoryModel = require("../models/categoryModel.js");
const orderModel = require("../models/orderModel.js");
const productModel = require("../models/productModel.js");
const userModel = require("../models/userModel.js");

// 📊 একটাই API - সব ডাটা একসাথে
const getDashboardStats = async (req, res) => {
    try {
        console.log("Fetching complete dashboard data...");

        // সব ডাটা parallel এ fetch করুন
        const [
            // Total Counts
            totalUsers,
            totalProducts,
            totalCategories,
            totalBrands,
            
            // Order Status Counts
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            
            // Total Income
            totalIncome,
            
            // Recent Orders (লেটেস্ট ১০টি)
            recentOrders,
            
            // Recent Users (লেটেস্ট ৫ জন)
            recentUsers,
            
            // Top Selling Products
            topProducts,
            
            // Low Stock Products
            lowStockProducts,
            
            // Category wise stats
            categoryStats,
            
            // Brand wise stats
            brandStats,
            
            // Monthly Sales (লাস্ট ৬ মাস)
            monthlySales
            
        ] = await Promise.all([
            // Basic Counts
            userModel.countDocuments(),
            productModel.countDocuments(),
            categoryModel.countDocuments(),
            brandModel.countDocuments(),
            
            // Order Status
            orderModel.countDocuments({ status: 'pending' }),
            orderModel.countDocuments({ status: 'processing' }),
            orderModel.countDocuments({ status: 'shipped' }),
            orderModel.countDocuments({ status: 'delivered' }),
            orderModel.countDocuments({ status: 'cancelled' }),
            
            // Total Income
            orderModel.aggregate([
                { $match: { status: 'delivered' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            
            // Recent Orders
            orderModel.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('orderId customer total status paymentMethod createdAt'),
            
            // Recent Users
            userModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('cus_name email cus_phone createdAt'),
            
            // Top Products
            orderModel.aggregate([
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.product_id',
                        product_name: { $first: '$items.product_name' },
                        totalSold: { $sum: '$items.quantity' },
                        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 }
            ]),
            
            // Low Stock Products
            productModel.find({ stock: { $lt: 10 } })
                .select('title stock price')
                .limit(5),
            
            // Category Statistics
            productModel.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' },
                {
                    $group: {
                        _id: '$category_id',
                        category_name: { $first: '$category.category_name' },
                        totalProducts: { $sum: 1 },
                        totalStock: { $sum: '$stock' }
                    }
                }
            ]),
            
            // Brand Statistics
            productModel.aggregate([
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brand_id',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },
                { $unwind: '$brand' },
                {
                    $group: {
                        _id: '$brand_id',
                        brand_name: { $first: '$brand.brand_name' },
                        totalProducts: { $sum: 1 },
                        totalStock: { $sum: '$stock' }
                    }
                }
            ]),
            
            // Monthly Sales (লাস্ট ৬ মাস)
            orderModel.aggregate([
                {
                    $match: {
                        status: 'delivered',
                        createdAt: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        totalSales: { $sum: '$total' },
                        totalOrders: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);

        // সব ডাটা একসাথে রিটার্ন করুন
        res.status(200).json({
            success: true,
            data: {
                // কার্ডের জন্য পরিসংখ্যান
                summary: {
                    totalUsers,
                    totalProducts,
                    totalCategories,
                    totalBrands,
                    totalOrders: pendingOrders + processingOrders + shippedOrders + deliveredOrders + cancelledOrders,
                    totalIncome: totalIncome[0]?.total || 0
                },
                
                // অর্ডার স্ট্যাটাস (পাই চার্টের জন্য)
                orderStatus: {
                    pending: pendingOrders,
                    processing: processingOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders
                },
                
                // সাম্প্রতিক ডাটা
                recentOrders,
                recentUsers,
                
                // বিশ্লেষণ
                topProducts,
                lowStockProducts,
                categoryStats,
                brandStats,
                monthlySales
            }
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = { getDashboardStats };