// // const express = require("express");
// // const app = express();
// // const rateLimit = require("express-rate-limit");
// // const helmet = require("helmet");

// // const hpp = require("hpp");
// // const cors = require("cors");
// // const cookieParser = require("cookie-parser");
// // const mongoose = require("mongoose");
// // require("dotenv").config();

// // const router = require("./src/routes/api");

// // let URL = "mongodb://127.0.0.1:27017/ostad_ecommerce";

// // let option = {
// //   autoIndex: true,
// //   serverSelectionTimeoutMS: 50000,
// // };

// // mongoose.connect(URL, option)
// //   .then(() => console.log("✅ MongoDB Connected"))
// //   .catch((err) => console.log("❌ Connection Error:", err));

// // mongoose.set("strictQuery", false);

// // // Global Middleware
// // app.use(cookieParser());

// // app.use(
// //   cors({
// //     origin: ["http://localhost:5173","http://localhost:5174"],
// //     credentials: true,
// //   })
// // );

// // app.use(express.urlencoded({ extended: true }));
// // app.use('/uploads', express.static('uploads'));







// // app.use(
// //   helmet.contentSecurityPolicy({
// //     useDefaults: true,
// //     directives: {
// //       "img-src": ["'self'", "data:", "https:"],
// //     },
// //   })
// // );

// // // app.use(mongoSanitize());
// // app.use(hpp());

// // app.use(express.json({ limit: "50mb" }));
// // app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000,
// //   max: 3000,
// // });
// // app.use(limiter);

// // app.use("/api/v1", router);
// // app.use("/api/v1/get-file", express.static("uploads"));



// // // app.use("/super-admin",
// // //     express.static(this.path.join(__dirname,"client","super-admin","dist"),{
// // //         index:false,
// // //     })
// // // );

// // // app.get("/super-admin/*",(req,res)=>{
// // //     res.sendFile(
// // //      path.resolve(__dirname,"client","super-admin","dist", "index.html")
// // //     )
// // // }
   
// // // );

// // // app.use(express.static(path.join(__dirname,"client","ecomerce","dist")));
// // // app.get("*",function(req,res){
// // //     res.sendFile(
// // //         path.resolve(__dirname,"client","ecomerce","dist", "index.html")
// // //     );
// // // });
// // module.exports = app;

// const express = require("express");
// const app = express();
// const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
// const hpp = require("hpp");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config();

// const router = require("./src/routes/api");

// // Database Connection
// let URL = "mongodb://127.0.0.1:27017/ostad_ecommerce";

// let option = {
//   autoIndex: true,
//   serverSelectionTimeoutMS: 50000,
// };

// mongoose.connect(URL, option)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ Connection Error:", err));

// mongoose.set("strictQuery", false);

// // ========== MIDDLEWARES ==========

// // Cookie Parser
// app.use(cookieParser());

// // CORS Configuration
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//   })
// );

// // Body Parser - IMPORTANT: একবারই ব্যবহার করুন
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// // Static Files (Uploaded images serve করার জন্য)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Security Middlewares
// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       "img-src": ["'self'", "data:", "https:"],
//     },
//   })
// );

// app.use(hpp());

// // Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 3000, // limit each IP to 3000 requests per windowMs
//   message: {
//     success: false,
//     message: "Too many requests from this IP, please try again later."
//   }
// });
// app.use(limiter);

// // ========== ROUTES ==========
// app.use("/api/v1", router);

// // File serving endpoint (optional - duplicate of static above)
// app.use("/api/v1/get-file", express.static(path.join(__dirname, "uploads")));

// // ========== 404 HANDLER (কোন রাউট না পাওয়া গেলে) ==========
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // ========== GLOBAL ERROR HANDLER ==========
// app.use((err, req, res, next) => {
//   console.error("Global Error:", err);
  
//   // Multer error handling
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     return res.status(400).json({
//       success: false,
//       message: "File too large. Maximum size is 5MB"
//     });
//   }
  
//   if (err.message === 'Only image files are allowed') {
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
  
//   res.status(500).json({
//     success: false,
//     message: err.message || "Internal server error"
//   });
// });

// module.exports = app;


const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const router = require("./src/routes/api");

// ========== CREATE UPLOADS DIRECTORY ==========
const uploadsDir = path.join(__dirname, 'src/uploads/products');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created:', uploadsDir);
} else {
    console.log('✅ Uploads directory already exists:', uploadsDir);
}

// Database Connection
//let URL = "mongodb://127.0.0.1:27017/ostad_ecommerce";
let URL = process.env.MONGO_URI;

let option = {
  autoIndex: true,
  serverSelectionTimeoutMS: 50000,
};

mongoose.connect(URL, option)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Connection Error:", err));

mongoose.set("strictQuery", false);

// ========== MIDDLEWARES ==========

// Cookie Parser
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Body Parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static Files (Uploaded images serve করার জন্য)
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Security Middlewares
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "data:", "https:", "http:"],
    },
  })
);

app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // limit each IP to 3000 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});
app.use(limiter);

// ========== ROUTES ==========
app.use("/api/v1", router);

// File serving endpoint (optional)
//app.use("/api/v1/get-file", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// ========== 404 HANDLER ==========
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ========== GLOBAL ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  
  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum size is 5MB"
    });
  }
  
  if (err.message === 'Only image files are allowed' || err.message.includes('image')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }
  
  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }
  
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

module.exports = app;