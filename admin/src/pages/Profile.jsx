

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";



function Profile() {
  const [admin, setAdmin] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get admin email on component mount
  useEffect(() => {
    fetchAdminEmail();
  }, []);

  const fetchAdminEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin");
      console.log("Admin response:", response.data);
      
      if (response.data.success) {
        // Extract email from different possible response structures
        const email = response.data.data?.email || 
                      response.data.admin?.email || 
                      response.data.email;
        setAdmin(prev => ({ ...prev, email: email || "" }));
      } else {
        setError(response.data.message || "Failed to load admin data");
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      setError(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!admin.email) {
      setError("Email is required");
      return;
    }
    
    setUpdating(true);
    setError("");
    setSuccess("");
    
    try {
      const updateData = { email: admin.email };
      
      // Only include password if provided
      if (admin.password && admin.password.trim() !== "") {
        updateData.password = admin.password;
      }
      
      const response = await api.put("/admin_Update", updateData);
      console.log("Update response:", response.data);
      
      if (response.data.success) {
        setSuccess("✅ Profile updated successfully!");
        setAdmin(prev => ({ ...prev, password: "" }));
        
        // Optional: Update token if email changed
        if (updateData.email !== admin.email) {
          setTimeout(() => {
            alert("Email changed! Please login again.");
            localStorage.clear();
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            👤 My Profile
          </h1>
          <p className="text-gray-400 mt-2">Manage your account information</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            ⚠️ {error}
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            ✅ {success}
          </div>
        )}

        {/* Profile Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Admin Information
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Email Address</span>
              <span className="text-white font-medium">{admin.email || "Not set"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Role</span>
              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">Administrator</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Account Status</span>
              <span className="text-green-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Update Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            Update Profile
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
              <p className="text-gray-500 text-xs mt-1">Email will be used for login</p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">New Password (Optional)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={admin.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1">Leave blank to keep current password</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  fetchAdminEmail();
                  setAdmin(prev => ({ ...prev, password: "" }));
                  setError("");
                  setSuccess("");
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
              >
                Refresh
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;