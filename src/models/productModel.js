const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product title is required"],
        trim: true,
        unique: true
    },
    images: [{
        type: String,
        required: [true, "At least one image is required"]
    }],
    short_description: {
        type: String,
        required: [true, "Short description is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    is_discount: {
        type: Boolean,
        default: false
    },
    discount_price: {
        type: Number,
        default: 0,
        min: [0, "Discount price cannot be negative"]
    },
    remark: {
        type: String,
        enum: ['', 'popular', 'new', 'featured', 'trending'],
        default: ''
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    color: [{
        type: String,
        trim: true
    }],
    size: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Category ID is required"]
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, "Brand ID is required"]
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);