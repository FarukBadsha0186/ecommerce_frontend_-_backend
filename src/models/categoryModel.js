// // const mongoose=require("mongoose");
// // const DataSchema=new mongoose.Schema(

// //     {
// //          category_name:{type:String,required:true, unique:true},
         

// //     },
// //     {
// //          timestamps:true,
// //            versionKey:false,
// //     }
// // );
// // const categoryModel= mongoose.model("categories",DataSchema);
// // module.exports=categoryModel;

// // models/categoryModel.js
// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//     category_name: {  // ← ফিল্ডের নাম category_name
//         type: String,
//         required: true,
//         unique: true
//     },
//     slug: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     keyword: {
//         type: String,
//         default: ''
//     },
//     totalProduct: {
//         type: Number,
//         default: 0
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Category', categorySchema);


const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category_img: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);