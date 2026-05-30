// const mongoose=require("mongoose");
// const DataSchema=new mongoose.Schema(

//     {
//          brand_name:{type:String,require:true, unique:true},
//           brand_img:{type:String,require:true, },

//     },
//     {
//          timestamps:true,
//            versionKey:false,
//     }
// );
// const brandModel= mongoose.model("brands",DataSchema);
// module.exports=brandModel;

const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true,
        trim: true
    },
    brand_img: {
        type: String,
        default: ""
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true  // প্রতিটি ব্র্যান্ড একটি ক্যাটাগরির আওতাভুক্ত
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

const brandModel = mongoose.model("Brand", DataSchema);  
module.exports = brandModel;