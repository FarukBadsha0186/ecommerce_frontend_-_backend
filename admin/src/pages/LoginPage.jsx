import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("📡 Logging in...");
      
      const response = await api.post("/admin-login", {
        email,
        password
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        // ✅ Token save করুন
        const token = response.data.token;
        if (token) {
          localStorage.setItem('adminToken', token);
          console.log("✅ Token saved");
        }
        
        // ✅ Dashboard এ যান
        navigate("/dashboard", { replace: true });
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
const handleGuestLogin = () => {
    localStorage.setItem('adminToken', 'guest_demo');
    localStorage.setItem('isGuest', 'true');
    navigate("/dashboard", { replace: true });
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-3 text-center text-gray-400 text-sm">or</div>

<button
    type="button"
    onClick={handleGuestLogin}
    className="w-full mt-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
>
    👀 Guest Login (Demo)
</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;