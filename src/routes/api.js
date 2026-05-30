const express = require("express");
const router = express.Router();


const admincontroller = require("../controllers/adminController.js");
const usercontroller = require("../controllers/userController.js");
const productcontroller = require("../controllers/productController.js");
const categorycontroller = require("../controllers/categoryController.js");
const brandcontroller=  require("../controllers/brandController.js");
const reviewcontroller= require("../controllers/reviewController.js");
const cartcontroller=   require("../controllers/cartController.js");
const orderController = require('../controllers/orderController');
const dashboardController = require('../controllers/dashboardController');
const authverificationAdmin = require("../middleware/authverificationAdmin.js");
const authverificationUser = require("../middleware/authVerificationUser.js");
const sslCommerz = require('../services/sslCommerz');
const paymentController = require('../controllers/paymentController');
//const { authverification } = require('../middleware/authMiddleware');

const upload = require('../config/multer');



router.post("/admin-register", admincontroller.register);
router.post("/admin-login", admincontroller.login);
router.get("/admin", authverificationAdmin,admincontroller.admin);
router.get("/adminVerify", authverificationAdmin,admincontroller.adminVerify);
router.post("/adminlogout", authverificationAdmin,admincontroller.adminlogout);
router.put("/admin_Update", authverificationAdmin,admincontroller.admin_Update);

router.post("/user-register", usercontroller.user_register);
router.post("/user-login", usercontroller.user_login);
router.get("/user_get", authverificationUser,usercontroller.user_get);
router.get("/userVerify", authverificationUser,usercontroller.userVerify);
router.post("/user/logout", authverificationUser,usercontroller.userlogout);
router.put("/user_Update", authverificationUser,usercontroller.user_Update);


//product
router.get("/public/product/:id", productcontroller.singleproduct);
router.post('/createProduct',authverificationAdmin,upload.array('images', 10),productcontroller.createProduct);
router.get("/admin/all_product/",authverificationAdmin,productcontroller.all_product);
router.get("/user/all_product/",authverificationUser,productcontroller.all_product);
router.get("/single_product/:id",authverificationAdmin,productcontroller.singleproduct);
router.post("/productUpdate/:id", authverificationAdmin,upload.array('new_images', 10),productcontroller.productUpdate);
//router.post("/productUpdate/:id", authverificationAdmin,productcontroller.productUpdate);
router.delete("/productDelete/:id", authverificationAdmin,productcontroller.productDelete);

//category
router.post("/category", authverificationAdmin,categorycontroller.category);
router.get("/all_category/",authverificationAdmin,categorycontroller.all_category);
router.get("/single_category/:id",authverificationAdmin,categorycontroller.single_category);

router.get("/all_category_single_category_name",authverificationAdmin,categorycontroller.all_category_single_category_name);
router.post("/category_Update/:id", authverificationAdmin,categorycontroller.category_Update);
//router.delete("/category_Delete/:id", authverificationAdmin,categorycontroller.category_Delete);
router.delete("/delete_category_by_name", authverificationAdmin,categorycontroller.delete_category_by_name);



//Brand

router.post("/createBrand", authverificationAdmin,brandcontroller.createBrand);
router.get("/getBrandsByCategory/:category_id",authverificationAdmin,brandcontroller.getBrandsByCategory);
router.get("/single_brand/:id",authverificationAdmin,brandcontroller.single_brand);
router.get("/all_brand_single_brand_name", authverificationAdmin,brandcontroller.all_brand_single_brand_name);
router.post("/brand_Update/:id", authverificationAdmin,brandcontroller.brand_Update);

router.delete("/delete_brand_by_name", authverificationAdmin,brandcontroller.delete_brand_by_name);
router.delete("/brand_Delete/:id", authverificationAdmin,brandcontroller.brand_Delete);




//review
router.post("/createReview", authverificationUser,reviewcontroller.createReview);
router.get("/all_Review",authverificationUser,reviewcontroller.all_Review);
router.get("/review/:product_id",authverificationUser,reviewcontroller.single_product_review);




// Cart routes
 router.post('/cart/Create',authverificationUser, cartcontroller.cartCreate);
 router.get('/cart/Read',authverificationUser, cartcontroller.cartRead);  // Changed: removed :user_id
 router.put('/cart/update/:product_id',authverificationUser, cartcontroller.updateCartQuantity);
 router.delete('/cart/delete/:product_id', authverificationUser, cartcontroller.cartdelete);
 router.delete('/cart/delete-by-id/:cart_id', authverificationUser, cartcontroller.deleteByCartId);
 router.delete('/cart/clear-all',authverificationUser,  cartcontroller.all_cart_clear);

// User routes
router.post('/order/create', authverificationAdmin, orderController.createOrder);  // Admin也可以创建订单
router.get('/my-orders', authverificationAdmin, orderController.getUserOrders);
router.get('/:id', authverificationAdmin, orderController.getOrderById);


// Admin routes (add admin middleware)
router.get('/order/all', authverificationAdmin, orderController.getAllOrders);
router.put('/status/:orderId', authverificationAdmin, orderController.updateOrderStatus);





router.post('/payment/initiate', paymentController.initiatePayment);
router.post('/payment/success', paymentController.paymentSuccess);
router.post('/payment/fail', paymentController.paymentFail);
router.post('/payment/cancel', paymentController.paymentCancel);
router.post('/payment/ipn', paymentController.handleIPN);






// ============== ADMIN ORDER MANAGEMENT ROUTES (New) ==============
router.get('/admin/orders', authverificationAdmin, orderController.getAllOrders);
router.get('/admin/orders/stats', authverificationAdmin, orderController.getOrderStats);
router.get('/admin/orders/status/:status', authverificationAdmin, orderController.getOrdersByStatus);
router.get('/admin/orders/:orderId', authverificationAdmin, orderController.getOrderById);
router.put('/admin/orders/:orderId/status', authverificationAdmin, orderController.updateOrderStatus);
router.put('/admin/orders/bulk/status', authverificationAdmin, orderController.bulkUpdateOrderStatus);
router.delete('/admin/orders/:orderId', authverificationAdmin, orderController.deleteOrder);



// ============== USER ORDER ROUTES ==============
// Get user's all orders
router.get('/user/my-orders', authverificationUser, orderController.getMyOrders);

// Get single order details
router.get('/user/my-orders/:orderId', authverificationUser, orderController.getMyOrderDetails);

// Cancel order
router.put('/user/orders/:orderId/cancel', authverificationUser, orderController.cancelOrder);

// Track order
router.get('/user/orders/:orderId/track', authverificationUser, orderController.trackOrder);
















router.get('/dashboard/stats', authverificationAdmin, dashboardController.getDashboardStats);

router.use('/uploads', express.static('uploads'));


module.exports = router;