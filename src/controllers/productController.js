
// const { default: mongoose } = require("mongoose");
// const productModel=require("../models/productModel");
// const ObjectId = mongoose.Types.ObjectId;




// // 
// exports.createProduct= async (req, res)=>{

//      try{

//          const {  title,type,
//                   images,
//                   short_description,
//                   price,
//                   is_discount,
//                   discount_price,
//                   remark,
//                   stock,
//                   color,
//                   size,
//                   description,
//                   category_id,
//                   brand_id } = req.body;


//                   if (price < discount_price){
//                     return res.status (200).json({
//                         success: false,
//                         message: "The  price must be smaller the main price",

//                     });
//                   }


//                   let data=await productModel.create({

//                  title,type,
//                   images,
//                   short_description,
//                   price,
//                   is_discount,
//                   discount_price,
//                   remark,
//                   stock,
//                   color,
//                   size,
//                   description,
//                   category_id,
//                   brand_id,

//                   });

//                    res.status(200).json({
//                     success :true,
//                     message: "Product created succesfully",
//                     data,
//                    });
     

//      } catch (error){
//           return res.status(500).json({
//        success: false,
//        message: error.message
//      });

//      }

// }


// //  exports.all_product= async(req, res)=>{
   
// //     try {

// //     let page_no=Number(req.params.page_no);
// //     let per_page=Number(req.params.per_page);
// //     let category_id=req.params.category_id;
// //     let brand_id=req.params.brand_id;
// //     let remark=req.params.remark;
// //     let keyword=req.params.keyword;
    

// //     let skipRow=(page_no - 1)*per_page;
// //     let shortstage={keyword: -1}

// //     let MatchingStage;
// //     if (category_id !=="0" ){

// //         MatchingStage :{ category_id: new ObjectId (category_id)};
// // } else if (brand_id !=="0" ){
// //      MatchingStage :{ brand_id: new ObjectId (brand_id)};

// // }
// // else if (remark !=="0" ){
// //      MatchingStage :{ remark: new ObjectId (remark)};

// // }
// // else if (keyword !=="0" ){
// //     let searchRegex ={
// //         $regex:keyword,
// //         $options:"i",
// //     };

// //     let searchParams=[{title:searchRegex}];
// //     let searchStage={
// //         $or:searchParams,

// //     };

// //     MatchingStage={
// //         $match: searchStage,
// //     };


// // }
// // else {
// //     MatchingStage= {
// //         $match:{}
// //     };
// // }     

// //  let joinwithcategoery={
// //     $lookup:{
// //         from :"categories",
// //         localField: "category_id",
// //         foreignField:"_id",
// //         as:"category",
// //     },
// //  };

// //  let fecetStage={
// //     $facet:{
// //         totalCount: [{$count: "count"}],
// //         product :[
// //             {$sort :shortstage},
// //             {$skip : skipRow},
// //             {$limit : per_page},
// //             joinwithcategoery,
           

// //         ]
// //     }
// //  }

// //  let product =await productModel.aggregate([MatchingStage,fecetStage])
// //     res.status(200).json({
// //         success:true,
// //         message: "Product fetched Succesfully",
// //         data: product[0]
// //     })


// //     } catch (error) {
        
// //      return res.status(500).json({
// //        success: false,
// //        message: error.message
// //      });
 
        
// //     }
// //  }


// exports.all_product = async (req, res) => {
//   try {
//     // 👉 Query params
//     const page_no = Number(req.query.page_no) || 1;
//     const per_page = Number(req.query.per_page) || 10;
//     const category_id = req.query.category_id || "0";
//     const brand_id = req.query.brand_id || "0";
//     const remark = req.query.remark || "0";
//     const keyword = req.query.keyword || "0";

//     const skipRow = (page_no - 1) * per_page;

//     // 👉 Build Matching Stage
//     let matchStage = {};

//     if (category_id !== "0") {
//       matchStage.category_id = new ObjectId(category_id);
//     }
//     if (brand_id !== "0") {
//       matchStage.brand_id = new ObjectId(brand_id);
//     }
//     if (remark !== "0") {
//       matchStage.remark = remark;
//     }
//     if (keyword !== "0") {
//       matchStage.title = { $regex: keyword, $options: "i" };
//     }

//     // 👉 Join with categories
//     let joinWithCategory = {
//       $lookup: {
//         from: "categories",
//         localField: "category_id",
//         foreignField: "_id",
//         as: "category",
//       },
//     };

//     // 👉 Facet stage for pagination + total count
//     let facetStage = {
//       $facet: {
//         totalCount: [{ $count: "count" }],
//         products: [
//           { $match: matchStage },
//           { $sort: { title: -1 } },
//           { $skip: skipRow },
//           { $limit: per_page },
//           joinWithCategory,
//         ],
//       },
//     };

//     let result = await productModel.aggregate([facetStage]);

//     const data = result[0] || { totalCount: [], products: [] };

//     res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       total: data.totalCount[0] ? data.totalCount[0].count : 0,
//       page_no,
//       per_page,
//       products: data.products,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//  exports.singleproduct=async (req, res)=>{
//     try{

//         const id = new ObjectId(req.params.id);
//         let MatchingStage={
//             $match: {_id :id },
//          };
//          let  joinwithcategoery={
//             $lookup:
//             {
//                 from:"categories",
//                 localField:"category_id",
//                 foreignField:"_id",
//                 as: "category",

//             },
            
//          };

//           let  joinwithBrand={
//             $lookup:
//             {
//                 from:"brands",
//                 localField:"brand_id",
//                 foreignField:"_id",
//                 as: "brand",

//             },
            
//          };

//          let data =await productModel.aggregate([MatchingStage,joinwithcategoery, joinwithBrand])
//           res.status(200).json({
//             success: true,
//             message:"Product fetched Succesfully",
//             data,
//           });




//     } catch (error){

//          return res.status(500).json({
//        success: false,
//        message: error.message
//      });
 

//     }
//  }

//  exports.productUpdate= async (req, res)=>{
//     try {
//         const id = req.params.id;

// const {  title,type,
//                   images,
//                   short_description,
//                   price,
//                   is_discount,
//                   discount_price,
//                   remark,
//                   stock,
//                   color,
//                   size,
//                   description,
//                   category_id,
//                   brand_id } = req.body;


                  
//                   if (price < discount_price){
//                     return res.status (200).json({
//                         success: false,
//                         message: "The  price must be smaller the main price",

//                     });
//                   }
//    let data = await productModel.findByIdAndUpdate(id,{title,type,
//                   images,
//                   short_description,
//                   price,
//                   is_discount,
//                   discount_price,
//                   remark,
//                   stock,
//                   color,
//                   size,
//                   description,
//                   category_id,
//                   brand_id 
   

    
//    },
//    { new: true}
// );
//  res.status(200).json({
//                     success :true,
//                     message: "Product updated succesfully",
//                     data,
//                    });
     

//     }catch(error){
//           return res.status(500).json({
//        success: false,
//        message: error.message
//      });
 

//     }
//  }


//   exports.productDelete = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await productModel.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//       data: deleted,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const { default: mongoose } = require("mongoose");
// const productModel = require("../models/productModel");
// const ObjectId = mongoose.Types.ObjectId;

// // ==================== CREATE PRODUCT ====================
// exports.createProduct = async (req, res) => {
//   try {
//     const {
//       title,
//       type,
//       images,
//       short_description,
//       price,
//       is_discount,
//       discount_price,
//       remark,
//       stock,
//       color,
//       size,
//       description,
//       category_id,
//       brand_id,
//     } = req.body;

//     // ✅ Fixed: Discount price should be less than original price
//     if (is_discount && discount_price && discount_price >= price) {
//       return res.status(400).json({
//         success: false,
//         message: "Discount price must be less than original price",
//       });
//     }

//     let data = await productModel.create({
//       title,
//       type,
//       images,
//       short_description,
//       price,
//       is_discount,
//       discount_price,
//       remark,
//       stock,
//       color,
//       size,
//       description,
//       category_id,
//       brand_id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET ALL PRODUCTS (with filters & pagination) ====================
// exports.all_product = async (req, res) => {
//   try {
//     // Get query parameters with defaults
//     let page_no = Number(req.query.page_no) || 1;
//     let per_page = Number(req.query.per_page) || 10;
//     let category_id = req.query.category_id || "0";
//     let brand_id = req.query.brand_id || "0";
//     let remark = req.query.remark || "0";
//     let keyword = req.query.keyword || "0";

//     let skipRow = (page_no - 1) * per_page;
//     let sortStage = { title: -1 }; // Sort by title descending

//     // ✅ Fixed: Build match stage properly
//     let matchStage = {};

//     if (category_id !== "0") {
//       matchStage.category_id = new ObjectId(category_id);
//     }
//     if (brand_id !== "0") {
//       matchStage.brand_id = new ObjectId(brand_id);
//     }
//     if (remark !== "0") {
//       matchStage.remark = remark;
//     }
//     if (keyword !== "0") {
//       matchStage.title = { $regex: keyword, $options: "i" };
//     }

//     // Join with categories
//     let joinWithCategory = {
//       $lookup: {
//         from: "categories",
//         localField: "category_id",
//         foreignField: "_id",
//         as: "category",
//       },
//     };

//     // Join with brands
//     let joinWithBrand = {
//       $lookup: {
//         from: "brands",
//         localField: "brand_id",
//         foreignField: "_id",
//         as: "brand",
//       },
//     };

//     // ✅ Fixed: Facet stage with proper structure
//     let facetStage = {
//       $facet: {
//         totalCount: [{ $count: "count" }],
//         products: [
//           { $match: matchStage },
//           { $sort: sortStage },
//           { $skip: skipRow },
//           { $limit: per_page },
//           joinWithCategory,
//           joinWithBrand,
//         ],
//       },
//     };

//     let result = await productModel.aggregate([facetStage]);

//     const data = result[0] || { totalCount: [], products: [] };

//     res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       total: data.totalCount[0] ? data.totalCount[0].count : 0,
//       page_no: page_no,
//       per_page: per_page,
//       products: data.products,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET SINGLE PRODUCT ====================
// exports.singleproduct = async (req, res) => {
//   try {
//     const id = new ObjectId(req.params.id);
    
//     let matchStage = {
//       $match: { _id: id },
//     };
    
//     let joinWithCategory = {
//       $lookup: {
//         from: "categories",
//         localField: "category_id",
//         foreignField: "_id",
//         as: "category",
//       },
//     };

//     let joinWithBrand = {
//       $lookup: {
//         from: "brands",
//         localField: "brand_id",
//         foreignField: "_id",
//         as: "brand",
//       },
//     };

//     let result = await productModel.aggregate([
//       matchStage,
//       joinWithCategory,
//       joinWithBrand,
//     ]);

//     // ✅ Fixed: Better response structure
//     if (!result || result.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product fetched successfully",
//       product: result[0], // Send single product object
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== UPDATE PRODUCT ====================
// exports.productUpdate = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const {
//       title,
//       type,
//       images,
//       short_description,
//       price,
//       is_discount,
//       discount_price,
//       remark,
//       stock,
//       color,
//       size,
//       description,
//       category_id,
//       brand_id,
//     } = req.body;

//     // ✅ Fixed: Discount price validation
//     if (is_discount && discount_price && discount_price >= price) {
//       return res.status(400).json({
//         success: false,
//         message: "Discount price must be less than original price",
//       });
//     }

//     let data = await productModel.findByIdAndUpdate(
//       id,
//       {
//         title,
//         type,
//         images,
//         short_description,
//         price,
//         is_discount,
//         discount_price,
//         remark,
//         stock,
//         color,
//         size,
//         description,
//         category_id,
//         brand_id,
//       },
//       { new: true, runValidators: true }
//     );

//     if (!data) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== DELETE PRODUCT ====================
// exports.productDelete = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await productModel.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//       data: deleted,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET PRODUCTS BY CATEGORY ====================
// exports.getProductsByCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
    
//     const products = await productModel.find({ category_id: categoryId })
//       .populate('category_id', 'name')
//       .limit(20);
    
//     res.status(200).json({
//       success: true,
//       products: products,
//       total: products.length
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET FEATURED PRODUCTS ====================
// exports.getFeaturedProducts = async (req, res) => {
//   try {
//     const products = await productModel.find({ remark: 'popular' })
//       .limit(10);
    
//     res.status(200).json({
//       success: true,
//       products: products
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// const { default: mongoose } = require("mongoose");
// const productModel = require("../models/productModel");
// const  categoryModel= require("../models/categoryModel");
// const fs = require('fs');
// const path = require('path');
// const ObjectId = mongoose.Types.ObjectId;

// // ==================== CREATE PRODUCT (with file upload) ====================
// // exports.createProduct = async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       type,
// //       short_description,
// //       price,
// //       is_discount,
// //       discount_price,
// //       remark,
// //       stock,
// //       color,
// //       size,
// //       description,
// //       category_id,
// //       brand_id,
// //     } = req.body;

// //     // Validate required fields
// //     if (!title || !price || !stock || !category_id || !brand_id) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Required fields missing: title, price, stock, category_id, brand_id",
// //       });
// //     }

// //     // ✅ Discount price validation
// //     if (is_discount && discount_price && Number(discount_price) >= Number(price)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Discount price must be less than original price",
// //       });
// //     }

// //     // Handle image uploads
// //     let imageUrls = [];
// //     if (req.files && req.files.length > 0) {
// //       imageUrls = req.files.map(file => {
// //         return `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
// //       });
// //     }

// //     // Parse arrays if they come as strings
// //     let parsedColor = color;
// //     let parsedSize = size;
    
// //     if (typeof color === 'string') {
// //       try {
// //         parsedColor = JSON.parse(color);
// //       } catch (e) {
// //         parsedColor = color.split(',').map(c => c.trim());
// //       }
// //     }
    
// //     if (typeof size === 'string') {
// //       try {
// //         parsedSize = JSON.parse(size);
// //       } catch (e) {
// //         parsedSize = size.split(',').map(s => s.trim());
// //       }
// //     }

// //     let data = await productModel.create({
// //       title,
// //       type: type || "product",
// //       images: imageUrls,
// //       short_description: short_description || "",
// //       price: Number(price),
// //       is_discount: is_discount === 'true' || is_discount === true,
// //       discount_price: discount_price ? Number(discount_price) : null,
// //       remark: remark || "new",
// //       stock: Number(stock),
// //       color: parsedColor || [],
// //       size: parsedSize || [],
// //       description: description || "",
// //       category_id: new ObjectId(category_id),
// //       brand_id: new ObjectId(brand_id),
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message: "Product created successfully",
// //       data,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };
// // controllers/productController.js



// // Create Product - FIXED
// exports.createProduct = async (req, res) => {
//     try {
//         console.log("========== CREATE PRODUCT ==========");
//         console.log("Request body:", req.body);
//         console.log("Request files:", req.files);
//         console.log("Content-Type:", req.headers['content-type']);
        
//         // 1. Required fields validation - ফ্রন্টেন্ড থেকে আসা ডাটা চেক করুন
//         const {
//             title,
//             short_description,
//             price,
//             is_discount,
//             discount_price,
//             remark,
//             stock,
//             description,
//             category_id,
//             brand_id,
//             color,
//             size
//         } = req.body;
        
//         // Required fields check with detailed logging
//         console.log("Checking required fields:");
//         console.log("title:", title);
//         console.log("price:", price);
//         console.log("stock:", stock);
//         console.log("category_id:", category_id);
//         console.log("brand_id:", brand_id);
        
//         if (!title) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Title is required"
//             });
//         }
        
//         if (!price) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Price is required"
//             });
//         }
        
//         if (!stock) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Stock is required"
//             });
//         }
        
//         if (!category_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Category ID is required"
//             });
//         }
        
//         if (!brand_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Brand ID is required"
//             });
//         }
        
//         if (!short_description) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Short description is required"
//             });
//         }
        
//         if (!description) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Description is required"
//             });
//         }
        
//         // 2. Validate category exists
//         const category = await categoryModel.findById(category_id);
//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found with this ID"
//             });
//         }
        
//         // 3. Validate brand exists
//         const brand = await brandModel.findById(brand_id);
//         if (!brand) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Brand not found with this ID"
//             });
//         }
        
//         // 4. Handle images
//         let imageUrls = [];
        
//         // Check if files are uploaded via multer
//         if (req.files && req.files.length > 0) {
//             console.log(`Processing ${req.files.length} uploaded files`);
//             imageUrls = req.files.map(file => {
//                 return `/uploads/products/${file.filename}`;
//             });
//         }
        
//         // Also check for images in body (URLs)
//         if (req.body.images) {
//             try {
//                 let images = req.body.images;
//                 if (typeof images === 'string') {
//                     images = JSON.parse(images);
//                 }
//                 if (Array.isArray(images) && images.length > 0) {
//                     console.log(`Adding ${images.length} image URLs from body`);
//                     imageUrls = [...imageUrls, ...images];
//                 }
//             } catch (e) {
//                 console.log("Images parse error:", e.message);
//             }
//         }
        
//         // If no images found
//         if (imageUrls.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "At least one product image is required"
//             });
//         }
        
//         // 5. Parse array fields (color, size)
//         let colorArray = [];
//         let sizeArray = [];
        
//         try {
//             if (color) {
//                 colorArray = typeof color === 'string' ? JSON.parse(color) : color;
//                 console.log("Color array:", colorArray);
//             }
//             if (size) {
//                 sizeArray = typeof size === 'string' ? JSON.parse(size) : size;
//                 console.log("Size array:", sizeArray);
//             }
//         } catch (e) {
//             console.log("Parse error for color/size:", e.message);
//             // If parsing fails, try to use as is
//             if (color && typeof color === 'string') {
//                 colorArray = color.split(',').map(c => c.trim());
//             }
//             if (size && typeof size === 'string') {
//                 sizeArray = size.split(',').map(s => s.trim());
//             }
//         }
        
//         // 6. Process is_discount properly
//         let isDiscountValue = false;
//         if (is_discount === true || is_discount === 'true' || is_discount === 1 || is_discount === '1') {
//             isDiscountValue = true;
//         }
        
//         let discountPriceValue = 0;
//         if (discount_price && isDiscountValue) {
//             discountPriceValue = Number(discount_price);
//         }
        
//         // 7. Create product data object
//         const productData = {
//             title: title.trim(),
//             short_description: short_description.trim(),
//             price: Number(price),
//             is_discount: isDiscountValue,
//             discount_price: discountPriceValue,
//             remark: remark || "",
//             stock: Number(stock),
//             description: description.trim(),
//             category_id: category_id,
//             brand_id: brand_id,
//             color: colorArray,
//             size: sizeArray,
//             images: imageUrls
//         };
        
//         console.log("Final product data to save:", JSON.stringify(productData, null, 2));
        
//         // 8. Check if product with same title exists
//         const existingProduct = await productModel.findOne({ title: productData.title });
//         if (existingProduct) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Product with this title already exists"
//             });
//         }
        
//         // 9. Save to database
//         const newProduct = await productModel.create(productData);
        
//         // 10. Populate category and brand info
//         const populatedProduct = await productModel.findById(newProduct._id)
//             .populate('category_id', 'category_name')
//             .populate('brand_id', 'brand_name');
        
//         console.log("Product created successfully:", populatedProduct._id);
        
//         res.status(201).json({
//             success: true,
//             message: "Product created successfully",
//             data: populatedProduct
//         });
        
//     } catch (error) {
//         console.error("Create product error:", error);
        
//         // Handle duplicate key error
//         if (error.code === 11000) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Product with this title already exists"
//             });
//         }
        
//         // Handle validation errors
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(err => err.message);
//             return res.status(400).json({
//                 success: false,
//                 message: messages.join(', ')
//             });
//         }
        
//         // Handle cast errors (invalid ObjectId)
//         if (error.name === 'CastError') {
//             return res.status(400).json({
//                 success: false,
//                 message: `Invalid ${error.path}: ${error.value}`
//             });
//         }
        
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Internal server error"
//         });
//     }
// };



// // ==================== GET ALL PRODUCTS (with filters & pagination) ====================
// exports.all_product = async (req, res) => {
//   try {
//     // Get query parameters with defaults
//     let page_no = Number(req.query.page_no) || 1;
//     let per_page = Number(req.query.per_page) || 10;
//     let category_id = req.query.category_id || "0";
//     let brand_id = req.query.brand_id || "0";
//     let remark = req.query.remark || "0";
//     let keyword = req.query.keyword || "0";
//     let minPrice = req.query.minPrice || "0";
//     let maxPrice = req.query.maxPrice || "0";

//     let skipRow = (page_no - 1) * per_page;
//     let sortStage = { createdAt: -1 }; // Sort by newest first

//     // ✅ Build match stage properly
//     let matchStage = {};

//     if (category_id !== "0") {
//       matchStage.category_id = new ObjectId(category_id);
//     }
//     if (brand_id !== "0") {
//       matchStage.brand_id = new ObjectId(brand_id);
//     }
//     if (remark !== "0") {
//       matchStage.remark = remark;
//     }
//     if (keyword !== "0") {
//       matchStage.title = { $regex: keyword, $options: "i" };
//     }
    
//     // Price range filter
//     if (minPrice !== "0" || maxPrice !== "0") {
//       matchStage.price = {};
//       if (minPrice !== "0") matchStage.price.$gte = Number(minPrice);
//       if (maxPrice !== "0") matchStage.price.$lte = Number(maxPrice);
//     }

//     // Join with categories
//     let joinWithCategory = {
//       $lookup: {
//         from: "categories",
//         localField: "category_id",
//         foreignField: "_id",
//         as: "category",
//       },
//     };

//     // Join with brands
//     let joinWithBrand = {
//       $lookup: {
//         from: "brands",
//         localField: "brand_id",
//         foreignField: "_id",
//         as: "brand",
//       },
//     };

//     // Unwind category and brand (to get object instead of array)
//     let unwindCategory = {
//       $unwind: {
//         path: "$category",
//         preserveNullAndEmptyArrays: true
//       }
//     };
    
//     let unwindBrand = {
//       $unwind: {
//         path: "$brand",
//         preserveNullAndEmptyArrays: true
//       }
//     };

//     // Add discount calculation
//     let addDiscountField = {
//       $addFields: {
//         finalPrice: {
//           $cond: {
//             if: { $and: ["$is_discount", { $ne: ["$discount_price", null] }] },
//             then: "$discount_price",
//             else: "$price"
//           }
//         },
//         discountPercentage: {
//           $cond: {
//             if: { $and: ["$is_discount", { $ne: ["$discount_price", null] }] },
//             then: {
//               $multiply: [
//                 { $divide: [{ $subtract: ["$price", "$discount_price"] }, "$price"] },
//                 100
//               ]
//             },
//             else: 0
//           }
//         }
//       }
//     };

//     // ✅ Facet stage with proper structure
//     let facetStage = {
//       $facet: {
//         totalCount: [
//           { $match: matchStage },
//           { $count: "count" }
//         ],
//         products: [
//           { $match: matchStage },
//           { $sort: sortStage },
//           { $skip: skipRow },
//           { $limit: per_page },
//           joinWithCategory,
//           joinWithBrand,
//           unwindCategory,
//           unwindBrand,
//           addDiscountField
//         ],
//       },
//     };

//     let result = await productModel.aggregate([facetStage]);

//     const data = result[0] || { totalCount: [], products: [] };

//     res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       total: data.totalCount[0] ? data.totalCount[0].count : 0,
//       page_no: page_no,
//       per_page: per_page,
//       total_pages: Math.ceil((data.totalCount[0] ? data.totalCount[0].count : 0) / per_page),
//       products: data.products,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET ALL PRODUCTS WITHOUT PAGINATION ====================
// exports.all_products_no_pagination = async (req, res) => {
//   try {
//     let products = await productModel.find()
//       .populate('category_id', 'name')
//       .populate('brand_id', 'name')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "All products fetched successfully",
//       total: products.length,
//       products: products,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET SINGLE PRODUCT ====================
// exports.singleproduct = async (req, res) => {
//   try {
//     const id = new ObjectId(req.params.id);
    
//     let matchStage = {
//       $match: { _id: id },
//     };
    
//     let joinWithCategory = {
//       $lookup: {
//         from: "categories",
//         localField: "category_id",
//         foreignField: "_id",
//         as: "category",
//       },
//     };

//     let joinWithBrand = {
//       $lookup: {
//         from: "brands",
//         localField: "brand_id",
//         foreignField: "_id",
//         as: "brand",
//       },
//     };
    
//     let unwindCategory = {
//       $unwind: {
//         path: "$category",
//         preserveNullAndEmptyArrays: true
//       }
//     };
    
//     let unwindBrand = {
//       $unwind: {
//         path: "$brand",
//         preserveNullAndEmptyArrays: true
//       }
//     };
    
//     let addDiscountField = {
//       $addFields: {
//         finalPrice: {
//           $cond: {
//             if: { $and: ["$is_discount", { $ne: ["$discount_price", null] }] },
//             then: "$discount_price",
//             else: "$price"
//           }
//         }
//       }
//     };

//     let result = await productModel.aggregate([
//       matchStage,
//       joinWithCategory,
//       joinWithBrand,
//       unwindCategory,
//       unwindBrand,
//       addDiscountField
//     ]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product fetched successfully",
//       product: result[0],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== UPDATE PRODUCT ====================
// exports.productUpdate = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const {
//       title,
//       type,
//       short_description,
//       price,
//       is_discount,
//       discount_price,
//       remark,
//       stock,
//       color,
//       size,
//       description,
//       category_id,
//       brand_id,
//       removeImages
//     } = req.body;

//     // Check if product exists
//     const existingProduct = await productModel.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // ✅ Discount price validation
//     if (is_discount && discount_price && Number(discount_price) >= Number(price)) {
//       return res.status(400).json({
//         success: false,
//         message: "Discount price must be less than original price",
//       });
//     }

//     // Handle image management
//     let imageUrls = existingProduct.images || [];
    
//     // Remove specified images
//     if (removeImages && removeImages.length > 0) {
//       const removeImageArray = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
      
//       // Delete files from server
//       removeImageArray.forEach(imageUrl => {
//         const filename = imageUrl.split('/').pop();
//         const filePath = path.join(__dirname, '../uploads/products', filename);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });
      
//       // Filter out removed images
//       imageUrls = imageUrls.filter(url => !removeImageArray.includes(url));
//     }
    
//     // Add new images
//     if (req.files && req.files.length > 0) {
//       const newImages = req.files.map(file => {
//         return `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
//       });
//       imageUrls = [...imageUrls, ...newImages];
//     }

//     // Parse arrays if they come as strings
//     let parsedColor = color;
//     let parsedSize = size;
    
//     if (typeof color === 'string') {
//       try {
//         parsedColor = JSON.parse(color);
//       } catch (e) {
//         parsedColor = color.split(',').map(c => c.trim());
//       }
//     }
    
//     if (typeof size === 'string') {
//       try {
//         parsedSize = JSON.parse(size);
//       } catch (e) {
//         parsedSize = size.split(',').map(s => s.trim());
//       }
//     }

//     let data = await productModel.findByIdAndUpdate(
//       id,
//       {
//         title: title || existingProduct.title,
//         type: type || existingProduct.type,
//         images: imageUrls,
//         short_description: short_description || existingProduct.short_description,
//         price: Number(price) || existingProduct.price,
//         is_discount: is_discount === 'true' || is_discount === true || existingProduct.is_discount,
//         discount_price: discount_price ? Number(discount_price) : existingProduct.discount_price,
//         remark: remark || existingProduct.remark,
//         stock: Number(stock) || existingProduct.stock,
//         color: parsedColor || existingProduct.color,
//         size: parsedSize || existingProduct.size,
//         description: description || existingProduct.description,
//         category_id: category_id ? new ObjectId(category_id) : existingProduct.category_id,
//         brand_id: brand_id ? new ObjectId(brand_id) : existingProduct.brand_id,
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== DELETE PRODUCT ====================
// exports.productDelete = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await productModel.findById(id);
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
    
//     // Delete associated images from server
//     if (product.images && product.images.length > 0) {
//       product.images.forEach(imageUrl => {
//         const filename = imageUrl.split('/').pop();
//         const filePath = path.join(__dirname, '../uploads/products', filename);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });
//     }

//     const deleted = await productModel.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//       data: deleted,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET PRODUCTS BY CATEGORY ====================
// exports.getProductsByCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     const page_no = Number(req.query.page_no) || 1;
//     const per_page = Number(req.query.per_page) || 20;
//     const skipRow = (page_no - 1) * per_page;
    
//     const products = await productModel.find({ category_id: categoryId })
//       .populate('category_id', 'name')
//       .populate('brand_id', 'name')
//       .skip(skipRow)
//       .limit(per_page)
//       .sort({ createdAt: -1 });
    
//     const total = await productModel.countDocuments({ category_id: categoryId });
    
//     res.status(200).json({
//       success: true,
//       products: products,
//       total: total,
//       page_no: page_no,
//       per_page: per_page,
//       total_pages: Math.ceil(total / per_page)
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET PRODUCTS BY BRAND ====================
// exports.getProductsByBrand = async (req, res) => {
//   try {
//     const brandId = req.params.brandId;
//     const page_no = Number(req.query.page_no) || 1;
//     const per_page = Number(req.query.per_page) || 20;
//     const skipRow = (page_no - 1) * per_page;
    
//     const products = await productModel.find({ brand_id: brandId })
//       .populate('category_id', 'name')
//       .populate('brand_id', 'name')
//       .skip(skipRow)
//       .limit(per_page)
//       .sort({ createdAt: -1 });
    
//     const total = await productModel.countDocuments({ brand_id: brandId });
    
//     res.status(200).json({
//       success: true,
//       products: products,
//       total: total,
//       page_no: page_no,
//       per_page: per_page,
//       total_pages: Math.ceil(total / per_page)
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET FEATURED PRODUCTS ====================
// exports.getFeaturedProducts = async (req, res) => {
//   try {
//     const limit = Number(req.query.limit) || 10;
//     const products = await productModel.find({ 
//       $or: [
//         { remark: 'popular' },
//         { remark: 'featured' },
//         { remark: 'trending' }
//       ]
//     })
//     .populate('category_id', 'name')
//     .populate('brand_id', 'name')
//     .limit(limit)
//     .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       products: products,
//       total: products.length
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET DISCOUNTED PRODUCTS ====================
// exports.getDiscountedProducts = async (req, res) => {
//   try {
//     const limit = Number(req.query.limit) || 10;
//     const products = await productModel.find({ 
//       is_discount: true,
//       discount_price: { $ne: null, $gt: 0 }
//     })
//     .populate('category_id', 'name')
//     .populate('brand_id', 'name')
//     .limit(limit)
//     .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       products: products,
//       total: products.length
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== UPDATE PRODUCT STOCK ====================
// exports.updateStock = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { quantity, operation } = req.body; // operation: 'add' or 'remove'
    
//     const product = await productModel.findById(id);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
    
//     let newStock = product.stock;
//     if (operation === 'add') {
//       newStock += quantity;
//     } else if (operation === 'remove') {
//       if (product.stock < quantity) {
//         return res.status(400).json({
//           success: false,
//           message: "Insufficient stock",
//         });
//       }
//       newStock -= quantity;
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid operation. Use 'add' or 'remove'",
//       });
//     }
    
//     const updated = await productModel.findByIdAndUpdate(
//       id,
//       { stock: newStock },
//       { new: true }
//     );
    
//     res.status(200).json({
//       success: true,
//       message: "Stock updated successfully",
//       product: updated
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== SEARCH PRODUCTS ====================
// exports.searchProducts = async (req, res) => {
//   try {
//     const { q } = req.query;
//     const page_no = Number(req.query.page_no) || 1;
//     const per_page = Number(req.query.per_page) || 20;
//     const skipRow = (page_no - 1) * per_page;
    
//     if (!q || q.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: "Search query is required",
//       });
//     }
    
//     const searchRegex = { $regex: q, $options: 'i' };
    
//     const products = await productModel.find({
//       $or: [
//         { title: searchRegex },
//         { short_description: searchRegex },
//         { description: searchRegex },
//         { color: { $in: [searchRegex] } },
//         { size: { $in: [searchRegex] } }
//       ]
//     })
//     .populate('category_id', 'name')
//     .populate('brand_id', 'name')
//     .skip(skipRow)
//     .limit(per_page)
//     .sort({ createdAt: -1 });
    
//     const total = await productModel.countDocuments({
//       $or: [
//         { title: searchRegex },
//         { short_description: searchRegex },
//         { description: searchRegex }
//       ]
//     });
    
//     res.status(200).json({
//       success: true,
//       products: products,
//       total: total,
//       page_no: page_no,
//       per_page: per_page,
//       total_pages: Math.ceil(total / per_page),
//       search_query: q
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const fs = require('fs');
const path = require('path');
const ObjectId = mongoose.Types.ObjectId;

// ==================== CREATE PRODUCT (with file upload) ====================
exports.createProduct = async (req, res) => {
    try {
        console.log("========== CREATE PRODUCT ==========");
        console.log("Request body:", req.body);
        console.log("Request files:", req.files ? req.files.length : 0, "files");

        // 1. Extract data from request body
        const {
            title,
            short_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            description,
            category_id,
            brand_id,
            color,
            size
        } = req.body;

        // 2. Required fields validation
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }
        if (!price) {
            return res.status(400).json({
                success: false,
                message: "Price is required"
            });
        }
        if (!stock) {
            return res.status(400).json({
                success: false,
                message: "Stock is required"
            });
        }
        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }
        if (!brand_id) {
            return res.status(400).json({
                success: false,
                message: "Brand ID is required"
            });
        }
        if (!short_description) {
            return res.status(400).json({
                success: false,
                message: "Short description is required"
            });
        }
        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }

        // 3. Validate category exists
        const category = await categoryModel.findById(category_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found with this ID"
            });
        }

        // 4. Validate brand exists
        const brand = await brandModel.findById(brand_id);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found with this ID"
            });
        }

        // 5. Handle image uploads from multer
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            console.log(`Processing ${req.files.length} uploaded files`);
            imageUrls = req.files.map(file => {
                // Return relative path for static serving
                return `/uploads/products/${file.filename}`;
            });
        }

        // If no images uploaded
        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            });
        }

        // 6. Parse array fields (color, size)
        let colorArray = [];
        let sizeArray = [];

        try {
            if (color) {
                colorArray = typeof color === 'string' ? JSON.parse(color) : color;
            }
            if (size) {
                sizeArray = typeof size === 'string' ? JSON.parse(size) : size;
            }
        } catch (e) {
            // If parsing fails, split by comma
            if (color && typeof color === 'string') {
                colorArray = color.split(',').map(c => c.trim());
            }
            if (size && typeof size === 'string') {
                sizeArray = size.split(',').map(s => s.trim());
            }
        }

        // 7. Process is_discount properly
        let isDiscountValue = false;
        if (is_discount === true || is_discount === 'true' || is_discount === 1 || is_discount === '1') {
            isDiscountValue = true;
        }

        let discountPriceValue = 0;
        if (discount_price && isDiscountValue) {
            discountPriceValue = Number(discount_price);
            
            // Validate discount price
            if (discountPriceValue >= Number(price)) {
                return res.status(400).json({
                    success: false,
                    message: "Discount price must be less than original price"
                });
            }
        }

        // 8. Create product data object
        const productData = {
            title: title.trim(),
            short_description: short_description.trim(),
            price: Number(price),
            is_discount: isDiscountValue,
            discount_price: discountPriceValue,
            remark: remark || "",
            stock: Number(stock),
            description: description.trim(),
            category_id: new ObjectId(category_id),
            brand_id: new ObjectId(brand_id),
            color: colorArray,
            size: sizeArray,
            images: imageUrls
        };

        console.log("Saving product:", productData.title);

        // 9. Save to database
        const newProduct = await productModel.create(productData);

        // 10. Populate category and brand info
        const populatedProduct = await productModel.findById(newProduct._id)
            .populate('category_id', 'category_name')
            .populate('brand_id', 'brand_name');

        console.log("Product created successfully:", populatedProduct._id);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: populatedProduct
        });

    } catch (error) {
        console.error("Create product error:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Product with this title already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// ==================== GET ALL PRODUCTS ====================
// exports.all_product = async (req, res) => {
//     try {
//         let page_no = Number(req.query.page_no) || 1;
//         let per_page = Number(req.query.per_page) || 10;
//         let category_id = req.query.category_id || "0";
//         let brand_id = req.query.brand_id || "0";
//         let remark = req.query.remark || "0";
//         let keyword = req.query.keyword || "0";

//         let skipRow = (page_no - 1) * per_page;

//         // Build match stage
//         let matchStage = {};

//         if (category_id !== "0") {
//             matchStage.category_id = new ObjectId(category_id);
//         }
//         if (brand_id !== "0") {
//             matchStage.brand_id = new ObjectId(brand_id);
//         }
//         if (remark !== "0") {
//             matchStage.remark = remark;
//         }
//         if (keyword !== "0") {
//             matchStage.title = { $regex: keyword, $options: "i" };
//         }

//         // Get total count
//         const totalCount = await productModel.countDocuments(matchStage);

//         // Get paginated products
//         let products = await productModel.find(matchStage)
//             .populate('category_id', 'category_name')
//             .populate('brand_id', 'brand_name')
//             .sort({ createdAt: -1 })
//             .skip(skipRow)
//             .limit(per_page);

//         res.status(200).json({
//             success: true,
//             message: "Products fetched successfully",
//             total: totalCount,
//             page_no: page_no,
//             per_page: per_page,
//             total_pages: Math.ceil(totalCount / per_page),
//             products: products,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

exports.all_product = async (req, res) => {
    try {
        let page_no = Number(req.query.page_no) || 1;
        let per_page = Number(req.query.per_page) || 10;
        let category_id = req.query.category_id || "0";
        let brand_id = req.query.brand_id || "0";
        let remark = req.query.remark || "0";
        let keyword = req.query.keyword || "0";

        let skipRow = (page_no - 1) * per_page;

        // Build match stage
        let matchStage = {};

        if (category_id !== "0") {
            matchStage.category_id = new ObjectId(category_id);
        }
        if (brand_id !== "0") {
            matchStage.brand_id = new ObjectId(brand_id);
        }
        if (remark !== "0") {
            matchStage.remark = remark;
        }
        if (keyword !== "0") {
            matchStage.title = { $regex: keyword, $options: "i" };
        }

        // Get total count
        const totalCount = await productModel.countDocuments(matchStage);

        // Get paginated products with color and size
        let products = await productModel.find(matchStage)
            .select('title short_description description price is_discount discount_price remark stock color size images category_id brand_id createdAt')
            .populate('category_id', 'category_name')
            .populate('brand_id', 'brand_name')
            .sort({ createdAt: -1 })
            .skip(skipRow)
            .limit(per_page);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            total: totalCount,
            page_no: page_no,
            per_page: per_page,
            total_pages: Math.ceil(totalCount / per_page),
            products: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==================== GET SINGLE PRODUCT ====================
exports.singleproduct = async (req, res) => {
    try {
        const id = req.params.id;
        
        const product = await productModel.findById(id)
            .populate('category_id', 'category_name')
            .populate('brand_id', 'brand_name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== UPDATE PRODUCT ====================
// exports.productUpdate = async (req, res) => {
//     try {
//         const id = req.params.id;
//         console.log("========== UPDATE PRODUCT ==========");
//         console.log("Product ID:", id);

//         // Check if product exists
//         const existingProduct = await productModel.findById(id);
//         if (!existingProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found",
//             });
//         }

//         const {
//             title,
//             short_description,
//             price,
//             is_discount,
//             discount_price,
//             remark,
//             stock,
//             description,
//             category_id,
//             brand_id,
//             color,
//             size,
//             existing_images
//         } = req.body;

//         // Handle image management
//         let imageUrls = [];

//         // 1. Keep existing images
//         if (existing_images) {
//             try {
//                 imageUrls = typeof existing_images === 'string' 
//                     ? JSON.parse(existing_images) 
//                     : existing_images;
//             } catch (e) {
//                 imageUrls = existingProduct.images || [];
//             }
//         } else {
//             imageUrls = existingProduct.images || [];
//         }

//         // 2. Add new uploaded images
//         if (req.files && req.files.length > 0) {
//             const newImages = req.files.map(file => {
//                 return `/uploads/products/${file.filename}`;
//             });
//             imageUrls = [...imageUrls, ...newImages];
//         }

//         // Parse arrays
//         let colorArray = [];
//         let sizeArray = [];

//         try {
//             if (color) {
//                 colorArray = typeof color === 'string' ? JSON.parse(color) : color;
//             }
//             if (size) {
//                 sizeArray = typeof size === 'string' ? JSON.parse(size) : size;
//             }
//         } catch (e) {
//             if (color && typeof color === 'string') {
//                 colorArray = color.split(',').map(c => c.trim());
//             }
//             if (size && typeof size === 'string') {
//                 sizeArray = size.split(',').map(s => s.trim());
//             }
//         }

//         // Process discount
//         let isDiscountValue = false;
//         if (is_discount === true || is_discount === 'true' || is_discount === 1 || is_discount === '1') {
//             isDiscountValue = true;
//         } else if (is_discount === false || is_discount === 'false' || is_discount === 0 || is_discount === '0') {
//             isDiscountValue = false;
//         } else {
//             isDiscountValue = existingProduct.is_discount;
//         }

//         let discountPriceValue = existingProduct.discount_price;
//         if (discount_price && isDiscountValue) {
//             discountPriceValue = Number(discount_price);
//         }

//         // Update product
//         const updateData = {
//             title: title || existingProduct.title,
//             short_description: short_description || existingProduct.short_description,
//             price: price ? Number(price) : existingProduct.price,
//             is_discount: isDiscountValue,
//             discount_price: discountPriceValue,
//             remark: remark || existingProduct.remark,
//             stock: stock ? Number(stock) : existingProduct.stock,
//             description: description || existingProduct.description,
//             category_id: category_id ? new ObjectId(category_id) : existingProduct.category_id,
//             brand_id: brand_id ? new ObjectId(brand_id) : existingProduct.brand_id,
//             color: colorArray.length > 0 ? colorArray : existingProduct.color,
//             size: sizeArray.length > 0 ? sizeArray : existingProduct.size,
//             images: imageUrls
//         };

//         const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true })
//             .populate('category_id', 'category_name')
//             .populate('brand_id', 'brand_name');

//         res.status(200).json({
//             success: true,
//             message: "Product updated successfully",
//             data: updatedProduct,
//         });
//     } catch (error) {
//         console.error("Update product error:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
exports.productUpdate = async (req, res) => {
    try {
        console.log("========== UPDATE PRODUCT ==========");
        console.log("Product ID:", req.params.id);
        console.log("Request body:", req.body);
        console.log("Request files:", req.files ? req.files.length : 0, "files");

        const id = req.params.id;

        // 1. Check if product exists
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 2. Extract data from request body
        const {
            title,
            short_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            description,
            category_id,
            brand_id,
            color,
            size,
            existing_images
        } = req.body;

        // 3. Required fields validation (createProduct এর মতো)
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }
        if (!price) {
            return res.status(400).json({
                success: false,
                message: "Price is required"
            });
        }
        if (!stock) {
            return res.status(400).json({
                success: false,
                message: "Stock is required"
            });
        }
        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }
        if (!brand_id) {
            return res.status(400).json({
                success: false,
                message: "Brand ID is required"
            });
        }
        if (!short_description) {
            return res.status(400).json({
                success: false,
                message: "Short description is required"
            });
        }
        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }

        // 4. Validate category exists
        const category = await categoryModel.findById(category_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found with this ID"
            });
        }

        // 5. Validate brand exists
        const brand = await brandModel.findById(brand_id);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found with this ID"
            });
        }

        // 6. Handle image management
        let imageUrls = [];

        // Keep existing images from request
        if (existing_images) {
            try {
                imageUrls = typeof existing_images === 'string' 
                    ? JSON.parse(existing_images) 
                    : existing_images;
            } catch (e) {
                imageUrls = existingProduct.images || [];
            }
        } else {
            imageUrls = existingProduct.images || [];
        }

        // Add new uploaded images
        if (req.files && req.files.length > 0) {
            console.log(`Processing ${req.files.length} new uploaded files`);
            const newImages = req.files.map(file => {
                return `/uploads/products/${file.filename}`;
            });
            imageUrls = [...imageUrls, ...newImages];
        }

        // If no images (both existing and new) - createProduct এর মতো
        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            });
        }

        // 7. Parse array fields (color, size) - createProduct এর মতো
        let colorArray = [];
        let sizeArray = [];

        try {
            if (color) {
                colorArray = typeof color === 'string' ? JSON.parse(color) : color;
            }
            if (size) {
                sizeArray = typeof size === 'string' ? JSON.parse(size) : size;
            }
        } catch (e) {
            // If parsing fails, split by comma
            if (color && typeof color === 'string') {
                colorArray = color.split(',').map(c => c.trim());
            }
            if (size && typeof size === 'string') {
                sizeArray = size.split(',').map(s => s.trim());
            }
        }

        // 8. Process is_discount properly - createProduct এর মতো
        let isDiscountValue = false;
        if (is_discount === true || is_discount === 'true' || is_discount === 1 || is_discount === '1') {
            isDiscountValue = true;
        }

        let discountPriceValue = 0;
        if (discount_price && isDiscountValue) {
            discountPriceValue = Number(discount_price);
            
            // Validate discount price
            if (discountPriceValue >= Number(price)) {
                return res.status(400).json({
                    success: false,
                    message: "Discount price must be less than original price"
                });
            }
        }

        // 9. Create update data object (createProduct এর মতো)
        const updateData = {
            title: title.trim(),
            short_description: short_description.trim(),
            price: Number(price),
            is_discount: isDiscountValue,
            discount_price: discountPriceValue,
            remark: remark || "",
            stock: Number(stock),
            description: description.trim(),
            category_id: new ObjectId(category_id),
            brand_id: new ObjectId(brand_id),
            color: colorArray,
            size: sizeArray,
            images: imageUrls
        };

        console.log("Updating product:", updateData.title);

        // 10. Update in database
        const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('category_id', 'category_name')
            .populate('brand_id', 'brand_name');

        console.log("Product updated successfully:", updatedProduct._id);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        console.error("Update product error:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Product with this title already exists"
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle cast errors (invalid ObjectId)
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: `Invalid ${error.path}: ${error.value}`
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};






// ==================== DELETE PRODUCT ====================
exports.productDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Delete associated images from server
        if (product.images && product.images.length > 0) {
            product.images.forEach(imageUrl => {
                const filename = imageUrl.split('/').pop();
                const filePath = path.join(__dirname, '../uploads/products', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log("Deleted image:", filePath);
                }
            });
        }

        const deleted = await productModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deleted,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== DELETE PRODUCT IMAGE ====================
exports.deleteProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Remove image from array
        const updatedImages = product.images.filter(img => img !== imageUrl);
        
        // Delete file from server
        const filename = imageUrl.split('/').pop();
        const filePath = path.join(__dirname, '../uploads/products', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Update product
        product.images = updatedImages;
        await product.save();

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
            images: updatedImages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== GET PRODUCTS BY CATEGORY ====================
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        
        const products = await productModel.find({ category_id: categoryId })
            .populate('category_id', 'category_name')
            .populate('brand_id', 'brand_name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products: products,
            total: products.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== GET PRODUCTS BY BRAND ====================
exports.getProductsByBrand = async (req, res) => {
    try {
        const brandId = req.params.brandId;
        
        const products = await productModel.find({ brand_id: brandId })
            .populate('category_id', 'category_name')
            .populate('brand_id', 'brand_name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products: products,
            total: products.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== GET FEATURED PRODUCTS ====================
exports.getFeaturedProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        
        const products = await productModel.find({ 
            $or: [
                { remark: 'popular' },
                { remark: 'featured' },
                { remark: 'trending' }
            ]
        })
        .populate('category_id', 'category_name')
        .populate('brand_id', 'brand_name')
        .limit(limit)
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products: products,
            total: products.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== GET DISCOUNTED PRODUCTS ====================
exports.getDiscountedProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        
        const products = await productModel.find({ 
            is_discount: true,
            discount_price: { $ne: null, $gt: 0 }
        })
        .populate('category_id', 'category_name')
        .populate('brand_id', 'brand_name')
        .limit(limit)
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products: products,
            total: products.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== UPDATE PRODUCT STOCK ====================
exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, operation } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let newStock = product.stock;
        if (operation === 'add') {
            newStock += quantity;
        } else if (operation === 'remove') {
            if (product.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock",
                });
            }
            newStock -= quantity;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid operation. Use 'add' or 'remove'",
            });
        }

        const updated = await productModel.findByIdAndUpdate(
            id,
            { stock: newStock },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product: updated
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==================== SEARCH PRODUCTS ====================
exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const searchRegex = { $regex: q, $options: 'i' };

        const products = await productModel.find({
            $or: [
                { title: searchRegex },
                { short_description: searchRegex },
                { description: searchRegex }
            ]
        })
        .populate('category_id', 'category_name')
        .populate('brand_id', 'brand_name')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products: products,
            total: products.length,
            search_query: q
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};