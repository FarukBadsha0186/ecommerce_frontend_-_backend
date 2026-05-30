// const { DecodeToken } = require("../utility/tokenHelper");

// module.exports = (req, res, next) => {
//     let token = req.cookies["u_token"];

//     if (!token) {
//         return res.status(401).json({
//             status: 401,
//             message: "No token provided",
//         });
//     }

//     let decoded = DecodeToken(token);

//     if (!decoded) {
//         return res.status(401).json({
//             status: 401,
//             message: "Invalid token",
//         });
//     }

//     // ✅ Attach user info to req
//     req.user = {
//         email: decoded.email,
//         _id: decoded._id
//     };

//     console.log("Middleware user:", req.user); // Debug check

//     next();
// };

// const { DecodeToken } = require("../utility/tokenHelper");

// module.exports = (req, res, next) => {
//     // প্রথমে হেডার থেকে টোকেন নেওয়ার চেষ্টা করুন
//     let token = req.headers.authorization?.split(' ')[1];  // Bearer token থেকে টোকেন নেওয়া
//     let userId = req.headers._id;  // ইউজার আইডি হেডার থেকে নেওয়া
    
//     // যদি হেডারে না থাকে, তাহলে কুকি থেকে নেওয়ার চেষ্টা করুন
//     if (!token && req.cookies["u_token"]) {
//         token = req.cookies["u_token"];
//     }
    
//     console.log('========== AUTH MIDDLEWARE ==========');
//     console.log('Token from header:', token ? 'Yes' : 'No');
//     console.log('User ID from header:', userId);
//     console.log('Token from cookie:', req.cookies["u_token"] ? 'Yes' : 'No');
//     console.log('=====================================');

//     if (!token) {
//         return res.status(401).json({
//             status: 401,
//             message: "No token provided",
//         });
//     }

//     let decoded = DecodeToken(token);
//     console.log('Decoded token:', decoded);

//     if (!decoded) {
//         return res.status(401).json({
//             status: 401,
//             message: "Invalid token",
//         });
//     }
    
//     // চেক করুন ইউজার আইডি মিলছে কিনা
//     if (userId && decoded._id !== userId) {
//         console.log('User ID mismatch - Token:', decoded._id, 'Header:', userId);
//         return res.status(401).json({
//             status: 401,
//             message: "User ID mismatch",
//         });
//     }

//     // Attach user info to req
//     req.user = {
//         email: decoded.email,
//         _id: decoded._id
//     };

//     console.log("✅ Auth success - User:", req.user);

//     next();
// };


const { DecodeToken } = require("../utility/tokenHelper");

module.exports = (req, res, next) => {
    // প্রথমে হেডার থেকে টোকেন নেওয়ার চেষ্টা করুন
    let token = req.headers.authorization?.split(' ')[1];  // Bearer token থেকে টোকেন নেওয়া
    
    // যদি হেডারে না থাকে, তাহলে কুকি থেকে নেওয়ার চেষ্টা করুন
    if (!token && req.cookies["u_token"]) {
        token = req.cookies["u_token"];
    }
    
    console.log('========== AUTH MIDDLEWARE ==========');
    console.log('Token from header:', token ? 'Yes' : 'No');
    console.log('Token from cookie:', req.cookies["u_token"] ? 'Yes' : 'No');
    console.log('=====================================');

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "No token provided",
        });
    }

    let decoded = DecodeToken(token);
    console.log('Decoded token:', decoded);

    if (!decoded) {
        return res.status(401).json({
            status: 401,
            message: "Invalid token",
        });
    }
    
    // 🔥 গুরুত্বপূর্ণ: req.user_id সেট করুন (cartRead কন্ট্রোলার এর জন্য)
    req.user_id = decoded._id || decoded.user_id || decoded.id;
    
    // Attach user info to req
    req.user = {
        email: decoded.email,
        _id: decoded._id,
        user_id: req.user_id
    };

    console.log("✅ Auth success - User ID:", req.user_id);
    console.log("✅ Auth success - User:", req.user);

    next();
};