import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import CartPage from "../pages/CartPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/registerpage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmation from "../pages/OrderConfirmationPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFail from "../pages/PaymentFail";
import PaymentCancel from "../pages/PaymentCancel";
import PaymentMock from "../pages/PaymentMock";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";

// অর্ডার সম্পর্কিত পেজ ইম্পোর্ট
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import TrackOrder from "../pages/TrackOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "login",           // ✅ http://localhost:5174/login
        element: <LoginPage />,
      },
      {
        path: "user-login",      // ✅ http://localhost:5174/user-login (যোগ করুন)
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-fail",
        element: <PaymentFail />,
      },
      {
        path: "payment-cancel",
        element: <PaymentCancel />,
      },
      {
        path: "payment-mock",
        element: <PaymentMock />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      // অর্ডার রাউটস
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "my-orders/:orderId",
        element: <OrderDetails />,
      },
      {
        path: "track-order/:orderId",
        element: <TrackOrder />,
      },
    ],
  },
]);

export default router;