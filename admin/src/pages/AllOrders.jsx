// src/pages/AllOrders.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AllOrders() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to new orders page
    navigate('/admin/orders', { replace: true });
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <p className="text-gray-400">Redirecting to orders page...</p>
      </div>
    </div>
  );
}

export default AllOrders;