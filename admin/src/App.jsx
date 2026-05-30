import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateProduct from "./pages/CreateProduct";
import AllProducts from "./pages/AllProducts";
import EditProduct from "./pages/EditProduct";
import AllReviews from "./pages/AllReviews";
import Category from "./pages/Category";
import Brand from "./pages/Brand";
import AllOrders from "./pages/AllOrders";
import FileManager from "./pages/FileManager";
import Logout from "./pages/Logout";

// ✅ অর্ডার ম্যানেজমেন্টের জন্য নতুন ইম্পোর্ট
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  if (token === null || token === undefined || token === '') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout><Dashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Home redirect to dashboard */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } />
        
        {/* Profile Route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout><Profile /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Product Management Routes */}
        <Route path="/create-product" element={
          <ProtectedRoute>
            <DashboardLayout><CreateProduct /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/all-products" element={
          <ProtectedRoute>
            <DashboardLayout><AllProducts /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/edit-product/:id" element={
          <ProtectedRoute>
            <DashboardLayout><EditProduct /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Review Management Routes */}
        <Route path="/all-reviews" element={
          <ProtectedRoute>
            <DashboardLayout><AllReviews /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Category & Brand Routes */}
        <Route path="/category" element={
          <ProtectedRoute>
            <DashboardLayout><Category /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/brand" element={
          <ProtectedRoute>
            <DashboardLayout><Brand /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* ✅ Order Management Routes (Updated) */}
        <Route path="/all-orders" element={
          <ProtectedRoute>
            <DashboardLayout><AllOrders /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* ✅ New Order Routes with proper structure */}
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <DashboardLayout><Orders /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/orders/:orderId" element={
          <ProtectedRoute>
            <DashboardLayout><OrderDetails /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* File Manager Route */}
        <Route path="/file-manager" element={
          <ProtectedRoute>
            <DashboardLayout><FileManager /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Logout Route */}
        <Route path="/logout" element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        } />

        {/* 404 Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;