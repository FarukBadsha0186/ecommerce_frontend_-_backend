// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('Please fill all fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post('/api/v1/user-login', {
//         email: email,
//         password: password
//       });

//       console.log('API Response:', response.data);

//       // আপনার API response structure অনুযায়ী এডজাস্ট করুন
//       if (response.data.token || response.data.accessToken) {
//         const token = response.data.token || response.data.accessToken;
//         const user = response.data.user || response.data.data;
        
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
        
//         // Login成功后 হোম পেজে নিয়ে যান
//         navigate('/');
//       } else {
//         setError('Login successful but no token received');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="bg-white p-10 rounded-xl shadow w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center text-sm">
//             {error}
//           </div>
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border p-3 mb-4 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//           className="w-full border p-3 mb-6 rounded"
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? 'Logging...' : 'Login'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// import { useState } from 'react';
// import { useNavigate }  from 'react-router-dom';
// import { userLogin } from '../services/api'; // api.js থেকে ইম্পোর্ট করুন

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('Please fill all fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // api.js এর userLogin ফাংশন ব্যবহার করুন
//       const response = await userLogin({ email, password });
      
//       console.log('API Response:', response.data);

//       if (response.data.token) {
//         const token = response.data.token;
//         const user = response.data.user || { email: email };
        
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
        
//         navigate('/');
//         window.location.reload();
//       } else {
//         setError('Login successful but no token received');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="bg-white p-10 rounded-xl shadow w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center text-sm">
//             {error}
//           </div>
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border p-3 mb-4 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//           className="w-full border p-3 mb-6 rounded"
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? 'Logging...' : 'Login'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // const handleLogin = async () => {
//   //   if (!email || !password) {
//   //     setError('Please fill all fields');
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   setError('');

//   //   try {
//   //     console.log('Sending login request...');
//   //     console.log('Email:', email);
//   //     console.log('Password:', password);

//   //     const response = await axios({
//   //       method: 'post',
//   //       url: 'http://localhost:5000/api/v1/user-login',
//   //       data: {
//   //         email: email,
//   //         password: password
//   //       },
//   //       headers: {
//   //         'Content-Type': 'application/json'
//   //       }
//   //     });

//   //     console.log('Full Response:', response);
//   //     console.log('Response Data:', response.data);

//   //     if (response.data.success && response.data.token) {
//   //       const token = response.data.token;
//   //       const user = {
//   //         email: email,
//   //         name: email.split('@')[0]
//   //       };
        
//   //       localStorage.setItem('token', token);
//   //       localStorage.setItem('user', JSON.stringify(user));
        
//   //       console.log('Login Success!');
//   //       navigate('/');
//   //       window.location.reload();
//   //     } else {
//   //       setError(response.data.message || 'Login failed');
//   //     }
//   //   } catch (err) {
//   //     console.error('Login error:', err);
//   //     console.error('Error response:', err.response);
//   //     setError(err.response?.data?.message || 'Login failed');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const handleLogin = async () => {
//   if (!email || !password) {
//     setError('Please fill all fields');
//     return;
//   }

//   setLoading(true);
//   setError('');

//   try {
//     console.log('Sending login request...');
//     console.log('Email:', email);

//     const response = await axios({
//       method: 'post',
//       url: 'http://localhost:5000/api/v1/user-login',
//       data: {
//         email: email,
//         password: password
//       },
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('Response Data:', response.data);

//     if (response.data.success && response.data.token) {
//       const token = response.data.token;
      
//       // ✅ ইউজার আইডি সংগ্রহ করুন - এটা গুরুত্বপূর্ণ!
//       const userId = response.data.user?.id || response.data.user?._id;
//       const userName = response.data.user?.name || email.split('@')[0];
//       const userEmail = response.data.user?.email || email;
      
//       // ✅ সব ডাটা স্টোর করুন
//       localStorage.setItem('token', token);
      
//       if (userId) {
//         localStorage.setItem('userId', userId);  // 👈 এই লাইনটি যোগ করুন
//         console.log('✅ UserId stored:', userId);
//       } else {
//         console.warn('⚠️ No userId found in response:', response.data);
//       }
      
//       localStorage.setItem('user', JSON.stringify({
//         id: userId,
//         name: userName,
//         email: userEmail
//       }));
      
//       console.log('✅ Login Success!');
//       console.log('Stored Token:', localStorage.getItem('token'));
//       console.log('Stored UserId:', localStorage.getItem('userId'));
      
      
//      navigate('/', { replace: true });
//     } else {
//       setError(response.data.message || 'Login failed');
//     }
//   } catch (err) {
//     console.error('Login error:', err);
//     console.error('Error response:', err.response);
//     setError(err.response?.data?.message || 'Login failed');
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="bg-white p-10 rounded-xl shadow w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center text-sm">
//             {error}
//           </div>
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border p-3 mb-4 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//           className="w-full border p-3 mb-6 rounded"
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? 'Logging...' : 'Login'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // 👈 Link যোগ করুন
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending login request...');
      console.log('Email:', email);

      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/v1/user-login',
        data: {
          email: email,
          password: password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response Data:', response.data);

      if (response.data.success && response.data.token) {
        const token = response.data.token;
        
        const userId = response.data.user?.id || response.data.user?._id;
        const userName = response.data.user?.name || email.split('@')[0];
        const userEmail = response.data.user?.email || email;
        
        // AuthContext এর login ফাংশন ব্যবহার করুন
        await login(email, password);
        
        localStorage.setItem('token', token);
        
        if (userId) {
          localStorage.setItem('userId', userId);
          console.log('✅ UserId stored:', userId);
        }
        
        localStorage.setItem('user', JSON.stringify({
          id: userId,
          name: userName,
          email: userEmail
        }));
        
        console.log('✅ Login Success!');
        
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('cartUpdated'));
        
        navigate('/', { replace: true });
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full border p-3 mb-6 rounded"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Logging...' : 'Login'}
        </button>
        
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;