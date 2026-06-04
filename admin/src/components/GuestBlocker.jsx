import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestBlocker = ({ children, block = false }) => {
  const isGuest = localStorage.getItem('isGuest') === 'true';

  // block=true হলে পুরো page block করবে
  if (block && isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-xl border border-yellow-500">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Demo Mode</h2>
          <p className="text-gray-400">This feature is for admin only!</p>
        </div>
      </div>
    );
  }

  // block=false হলে শুধু button/action block করবে
  if (!block && isGuest) {
    return (
      <div
        onClick={() => alert('🔒 Demo Mode! This feature is for admin only!')}
        className="cursor-not-allowed"
      >
        <div style={{ pointerEvents: 'none', opacity: 0.5 }}>
          {children}
        </div>
      </div>
    );
  }

  return children;
};

export default GuestBlocker;