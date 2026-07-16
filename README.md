# 🛍️ Full Stack E-Commerce Application

A complete **MERN Stack** e-commerce platform with **User Frontend**, **Admin Panel**, and **RESTful API**.

---

## 🚀 Features

### 👤 User Features
- User Registration & Login (JWT)
- Browse Products with Search & Filter
- Add to Cart & Manage Cart
- Place Orders
- SSLCommerz Payment Integration
- Order History & Tracking
- Profile Management

### 👑 Admin Features
- Admin Dashboard with Stats
- Product Management (CRUD)
- Order Management (Status Update)
- User Management
- Sales Reports & Analytics
- Inventory Management

### 🔧 Backend Features
- RESTful API
- JWT Authentication
- Role-based Access Control (User/Admin)
- File Upload (Multer + Cloudinary)
- Payment Gateway (SSLCommerz)
- Security (Helmet, CORS, Rate Limit, XSS)

---

## 📚 Technology Stack

### Frontend (User + Admin)
- **React.js** + **Vite** (Build Tool)
- **TailwindCSS** (Styling)
- **React Router DOM** (Routing)
- **Axios** (API Calls)
- **Context API** (State Management)
- **React Hook Form** (Forms)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)
- **Multer** + **Cloudinary** (File Upload)
- **SSLCommerz** (Payment)
- **Nodemailer** (Email)

### Security
- Helmet.js
- CORS
- Express Rate Limit
- XSS-Clean
- HPP

---

## 📁 Project Structure
project-root/
│
├── backend/
│ ├── src/
│ │ ├── config/ # DB & env config
│ │ ├── controllers/ # Business logic
│ │ ├── middleware/ # Auth, error handling
│ │ ├── models/ # Mongoose models
│ │ ├── routes/ # API routes
│ │ ├── services/ # Cloudinary, SSLCommerz
│ │ ├── uploads/ # Local file storage
│ │ └── utility/ # Helper functions
│ ├── .env
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ │ ├── cart/
│ │ │ ├── common/
│ │ │ ├── home/
│ │ │ ├── layout/
│ │ │ └── products/
│ │ ├── pages/ # Page components
│ │ ├── context/ # Context API
│ │ ├── routes/ # Route definitions
│ │ ├── services/ # API service calls
│ │ └── assets/ # Images, fonts
│ ├── public/
│ └── package.json
│
├── admin-panel/
│ ├── src/
│ │ ├── components/ # Admin components
│ │ │ ├── dashboard/
│ │ │ ├── products/
│ │ │ ├── orders/
│ │ │ └── users/
│ │ ├── pages/ # Admin pages
│ │ ├── context/ # Admin context
│ │ ├── routes/ # Admin routes
│ │ └── services/ # API calls
│ └── package.json


## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas)
- npm 

### Step 1: Clone the Repository
```bash
```git clone https://github.com/FarukBadsha0186/ecommerce_frontend_-_backend.git
