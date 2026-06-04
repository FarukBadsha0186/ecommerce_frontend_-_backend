import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios'; // Make sure to install axios: npm install axios

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cus_name: '',        // Changed from 'name' to match backend
    email: '',
    password: '',
    confirmPassword: '',
    // Billing Information
    cuse_add: '',
    cuse_city: '',
    cuse_country: '',
    cuse_fax: '',
    cuse_phone: '',
    cuse_postcode: '',
    cuse_state: '',
    // Shipping Information
    ship_name: '',
    ship_add: '',
    ship_city: '',
    ship_country: '',
    ship_phone: '',
    ship_postcode: '',
    ship_state: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    // Clear API error when user starts typing
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.cus_name.trim()) newErrors.cus_name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Billing Information Validation
    if (!formData.cuse_add.trim()) newErrors.cuse_add = 'Billing address is required';
    if (!formData.cuse_city.trim()) newErrors.cuse_city = 'Billing city is required';
    if (!formData.cuse_country.trim()) newErrors.cuse_country = 'Billing country is required';
    if (!formData.cuse_phone.trim()) newErrors.cuse_phone = 'Billing phone is required';
    if (!formData.cuse_postcode.trim()) newErrors.cuse_postcode = 'Billing postcode is required';
    if (!formData.cuse_state.trim()) newErrors.cuse_state = 'Billing state is required';
    
    // Shipping Information Validation
    if (!formData.ship_name.trim()) newErrors.ship_name = 'Shipping name is required';
    if (!formData.ship_add.trim()) newErrors.ship_add = 'Shipping address is required';
    if (!formData.ship_city.trim()) newErrors.ship_city = 'Shipping city is required';
    if (!formData.ship_country.trim()) newErrors.ship_country = 'Shipping country is required';
    if (!formData.ship_phone.trim()) newErrors.ship_phone = 'Shipping phone is required';
    if (!formData.ship_postcode.trim()) newErrors.ship_postcode = 'Shipping postcode is required';
    if (!formData.ship_state.trim()) newErrors.ship_state = 'Shipping state is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setApiError('');
      
      try {
        // Prepare data for API (remove confirmPassword)
        const { confirmPassword, ...registrationData } = formData;
        
        console.log('Sending registration data:', registrationData);
        
        // Make API call to your backend
        const response = await axios.post(
          'https://ecommerce-8lhe.onrender.com/api/v1/user-register',
          registrationData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Registration response:', response.data);
        
        if (response.data.success) {
          // Show success message and redirect to login
          alert('Registration successful! Please login.');
          navigate('/login');
        } else {
          setApiError(response.data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.response) {
          // Server responded with error
          setApiError(error.response.data.message || 'Registration failed. Please try again.');
        } else if (error.request) {
          // Request was made but no response
          setApiError('Cannot connect to server. Please check if server is running.');
        } else {
          setApiError('An error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
              <h1 className="text-3xl font-bold text-white">Create Account</h1>
              <p className="text-blue-100 mt-2">Join ShopEase today</p>
            </div>
            
            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-6">
                {apiError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Full Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="cus_name"
                        value={formData.cus_name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.cus_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.cus_name && <p className="text-red-500 text-sm mt-1">{errors.cus_name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Confirm Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="••••••"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Billing Information */}
                  <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Billing Information</h3>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Address *</label>
                    <input
                      type="text"
                      name="cuse_add"
                      value={formData.cuse_add}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.cuse_add ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                      }`}
                      placeholder="Street Address"
                    />
                    {errors.cuse_add && <p className="text-red-500 text-sm mt-1">{errors.cuse_add}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">City *</label>
                      <input
                        type="text"
                        name="cuse_city"
                        value={formData.cuse_city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.cuse_city ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="City"
                      />
                      {errors.cuse_city && <p className="text-red-500 text-sm mt-1">{errors.cuse_city}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">State *</label>
                      <input
                        type="text"
                        name="cuse_state"
                        value={formData.cuse_state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.cuse_state ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="State"
                      />
                      {errors.cuse_state && <p className="text-red-500 text-sm mt-1">{errors.cuse_state}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Postcode *</label>
                      <input
                        type="text"
                        name="cuse_postcode"
                        value={formData.cuse_postcode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.cuse_postcode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Postcode"
                      />
                      {errors.cuse_postcode && <p className="text-red-500 text-sm mt-1">{errors.cuse_postcode}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Country *</label>
                      <input
                        type="text"
                        name="cuse_country"
                        value={formData.cuse_country}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.cuse_country ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Country"
                      />
                      {errors.cuse_country && <p className="text-red-500 text-sm mt-1">{errors.cuse_country}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Phone *</label>
                      <input
                        type="text"
                        name="cuse_phone"
                        value={formData.cuse_phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.cuse_phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Phone"
                      />
                      {errors.cuse_phone && <p className="text-red-500 text-sm mt-1">{errors.cuse_phone}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Fax</label>
                      <input
                        type="text"
                        name="cuse_fax"
                        value={formData.cuse_fax}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Fax (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Shipping Information */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h3>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Full Name *</label>
                    <input
                      type="text"
                      name="ship_name"
                      value={formData.ship_name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.ship_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                      }`}
                      placeholder="Shipping Name"
                    />
                    {errors.ship_name && <p className="text-red-500 text-sm mt-1">{errors.ship_name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Address *</label>
                    <input
                      type="text"
                      name="ship_add"
                      value={formData.ship_add}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.ship_add ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                      }`}
                      placeholder="Street Address"
                    />
                    {errors.ship_add && <p className="text-red-500 text-sm mt-1">{errors.ship_add}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">City *</label>
                      <input
                        type="text"
                        name="ship_city"
                        value={formData.ship_city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.ship_city ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="City"
                      />
                      {errors.ship_city && <p className="text-red-500 text-sm mt-1">{errors.ship_city}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">State *</label>
                      <input
                        type="text"
                        name="ship_state"
                        value={formData.ship_state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.ship_state ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="State"
                      />
                      {errors.ship_state && <p className="text-red-500 text-sm mt-1">{errors.ship_state}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Postcode *</label>
                      <input
                        type="text"
                        name="ship_postcode"
                        value={formData.ship_postcode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.ship_postcode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Postcode"
                      />
                      {errors.ship_postcode && <p className="text-red-500 text-sm mt-1">{errors.ship_postcode}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Country *</label>
                      <input
                        type="text"
                        name="ship_country"
                        value={formData.ship_country}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.ship_country ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Country"
                      />
                      {errors.ship_country && <p className="text-red-500 text-sm mt-1">{errors.ship_country}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Phone *</label>
                    <input
                      type="text"
                      name="ship_phone"
                      value={formData.ship_phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.ship_phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                      }`}
                      placeholder="Phone"
                    />
                    {errors.ship_phone && <p className="text-red-500 text-sm mt-1">{errors.ship_phone}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;