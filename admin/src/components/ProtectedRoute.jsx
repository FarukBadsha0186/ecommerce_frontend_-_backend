// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   // Check if user is authenticated
//   const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
//   const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  
//   // If not authenticated, redirect to login
//   if (!isAuthenticated || !token) {
//     return <Navigate to="/login" replace />;
//   }
  
//   // If authenticated, render the children components
//   return children;
// };

// export default ProtectedRoute;