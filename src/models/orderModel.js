// backend/models/orderModel.js

// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   orderId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   user_id: {
//     type: String,
//     required: true,
//     index: true
//   },
//   items: [{
//     product_id: { type: String, required: true },
//     product_name: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true },
//     colour: { type: String, default: '' },
//     size: { type: String, default: '' }
//   }],
//   customer: {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     zipCode: { type: String, required: true }
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['cod', 'bkash', 'nagad', 'card'],
//     default: 'cod'
//   },
//   subtotal: { type: Number, required: true },
//   shipping: { type: Number, required: true },
//   tax: { type: Number, required: true },
//   total: { type: Number, required: true },
//   notes: { type: String, default: '' },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Order', orderSchema);


// backend/src/models/orderModel.js
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   orderId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   user_id: {
//     type: String,
//     required: true,
//     index: true
//   },
//   items: [{
//     product_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true
//     },
//     product_name: {
//       type: String,
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1
//     },
//     price: {
//       type: Number,
//       required: true
//     },
//     colour: {
//       type: String,
//       default: ''
//     },
//     size: {
//       type: String,
//       default: ''
//     }
//   }],
//   customer: {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     zipCode: { type: String, required: true }
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['cod', 'bkash', 'nagad', 'card'],
//     default: 'cod'
//   },
//   subtotal: {
//     type: Number,
//     required: true
//   },
//   shipping: {
//     type: Number,
//     required: true
//   },
//   tax: {
//     type: Number,
//     default: 0
//   },
//   total: {
//     type: Number,
//     required: true
//   },
//   notes: {
//     type: String,
//     default: ''
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  items: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    product_name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    colour: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  }],
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'bkash', 'nagad', 'card'],
    default: 'cod'
  },
  
  // ========== 🔥 SSL COMMERZE এর জন্য নতুন ফিল্ড যোগ করুন ==========
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: ''
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  cardType: {
    type: String,
    default: ''
  },
  paymentDate: {
    type: Date
  },
  paymentDetails: {
    transactionId: { type: String },
    amount: { type: Number },
    cardType: { type: String },
    bankTranId: { type: String },
    cardNo: { type: String },
    paidAt: { type: Date }
  },
  // ==============================================================
  
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'payment_failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

