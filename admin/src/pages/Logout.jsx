// // src/pages/Logout.jsx
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../config/api";

// const Logout = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleLogout = async () => {
//       try {
//         // Call logout API if needed
//         await api.post('/adminlogout');
//       } catch (err) {
//         console.error('Logout API error:', err);
//       } finally {
//         // Clear all local storage data
//         localStorage.removeItem('adminToken');
//         localStorage.removeItem('token');
//         localStorage.removeItem('isAuthenticated');
//         localStorage.removeItem('user');
//         localStorage.removeItem('rememberedEmail');
        
//         // Redirect to login page
//         navigate('/login', { replace: true });
//       }
//     };

//     handleLogout();
//   }, [navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="text-center">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
//         <p className="text-white text-lg">Logging out...</p>
//       </div>
//     </div>
//   );
// };

// export default Logout;



// src/pages/Logout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const Logout = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleLogout = async () => {
      // Progress animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 200);

      try {
        // Call logout API if exists
        await api.post('/adminlogout').catch(() => {});
      } catch (err) {
        console.error('Logout API error:', err);
      } finally {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // ✅ IMPORTANT: Replace history to prevent back button
        setTimeout(() => {
          window.location.replace('/login');
        }, 500);
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mt-4">Logging out...</h2>
        <div className="w-48 bg-gray-700 rounded-full h-1 mt-3 mx-auto overflow-hidden">
          <div 
            className="bg-purple-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-3">Please wait</p>
      </div>
    </div>
  );
};

export default Logout;