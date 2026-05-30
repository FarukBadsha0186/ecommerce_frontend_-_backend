// const { default: mongoose } = require("mongoose");
// const brandModel = require("../models/brandModel");

//  exports.createBrand= async(req, res)=>{
//     try{

//         const {brand_name, brand_img }= req.body;

//            let data= await brandModel.create({brand_name,brand_img});
//             res.status(200).json({
//                  success :true,
//                  message: "Brand create succesfully",
//                  data,
//             })
//     }catch(error){
//           return res.status(500).json({
//        success: false,
//        message: error.message
//      });

//     }
//  }

//   //  exports.all_brand= async(req, res)=>{
    
//   //    try {
 
//   //    let page_no=Number(req.params.page_no);
//   //    let per_page=Number(req.params.per_page);
    
     
 
//   //    let skipRow=(page_no - 1)*per_page;
//   //    let shortstage={keyword: -1}
 
 
//   // let joinwithProduct={
//   //    $lookup:{
//   //        from :"products",
//   //        localField: "_id",
//   //        foreignField:"brand_id",
//   //        as:"products",
//   //    },
//   // };
 
//   // const addProductCount={
//   //    $addFields:{
//   //        totalProduct :{$size: "$products"},
//   //    },
//   // }
 
//   // let fecetStage={
//   //    $facet:{
//   //        totalCount: [{$count: "count"}],
//   //        categories :[
//   //            {$sort :shortstage},
//   //            {$skip : skipRow},
//   //            {$limit : per_page},
//   //            joinwithProduct,
//   //            addProductCount,
//   //            // {
//   //            //     $project:{
//   //            //         updatedAt:0,
//   //            //         products:0,
 
//   //            //     }
//   //            // }
            
 
//   //        ]
//   //    }
//   // }
 
//   // let categories  =await brandModel.aggregate([fecetStage])
//   //    res.status(200).json({
//   //        success:true,
//   //        message: "Brand fetched Succesfully",
//   //        data: categories[0]
//   //    })
 
 
//   //    } catch (error) {
         
//   //     return res.status(500).json({
//   //       success: false,
//   //       message: error.message
//   //     });
  
         
//   //    }
//   // }

//   exports.all_brand = async (req, res) => {
    
//     try {
 
//         let shortstage = { keyword: -1 }
        
//         let joinwithProduct = {
//             $lookup: {
//                 from: "products",
//                 localField: "_id",
//                 foreignField: "brand_id",
//                 as: "products",
//             },
//         };
        
//         const addProductCount = {
//             $addFields: {
//                 totalProduct: { $size: "$products" },
//             },
//         }
        
//         // Simple aggregation without pagination
//         let categories = await brandModel.aggregate([
//             { $sort: shortstage },
//             joinwithProduct,
//             addProductCount,
//             // {
//             //     $project: {
//             //         updatedAt: 0,
//             //         products: 0,
//             //     }
//             // }
//         ])
        
//         res.status(200).json({
//             success: true,
//             message: "Brand fetched Successfully",
//             data: categories,
//             totalCount: categories.length
//         })
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
 
//    exports.single_brand = async(req, res)=>{
//      try {
//           const {id}= req.params;
//           let data =await brandModel.findById(id);
 
//            return res.status(200).json({
//         success: true,
//         message:  "Brand fecthed succes fully",
//         data,
//            });
 
 
 
 
//      }catch(error){
//            return res.status(500).json({
//         success: false,
//         message: error.message
//       });
  
 
//      }
//    }
 
 
//     exports.brand_Update= async (req, res)=>{
//        try {
//            const id = req.params.id;
   
//          const { brand_name, brand_img} = req.body;
   
   
                     
                   
//       let data = await brandModel.findByIdAndUpdate(id,{brand_name, brand_img
       
//       },
//       { new: true}
//    );
//     res.status(200).json({
//                        success :true,
//                        message: "Brand  updated succesfully",
//                        data,
//                       });
        
   
//        }catch(error){
//              return res.status(500).json({
//           success: false,
//           message: error.message
//         });
    
   
//        }
//     }
 
//      exports.brand_Delete = async (req, res) => {
//       try {
//         const { id } = req.params;
    
//         const deleted = await brandModel.findByIdAndDelete(id);
    
//         if (!deleted) {
//           return res.status(404).json({
//             success: false,
//             message: "Brand not found",
//           });
//         }
    
//         res.status(200).json({
//           success: true,
//           message: "Brand deleted successfully",
//           data: deleted,
//         });
    
//       } catch (error) {
//         return res.status(500).json({
//           success: false,
//           message: error.message,
//         });
//       }
//     };


//     exports.all_brand_single_brand_name = async (req, res) => {
//     try {
//         // শুধুমাত্র brand_name ফিল্ড প্রজেক্ট করুন
//         const brands = await brandModel.aggregate([
//             {
//                 $project: {
//                     brand_name: 1,  // শুধুমাত্র brand_name ফিল্ড নিবে
//                     _id: 0             // _id ফিল্ড বাদ দিবে
//                 }
//             },
//             { $sort: { brand_name: 1 } }  // নাম অনুযায়ী সাজানো (A-Z)
//         ]);
        
//         res.status(200).json({
//             success: true,
//             message: "Brand names fetched successfully",
//             data: brands,
//             totalCount: brands.length
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// exports.delete_brand_by_name = async (req, res) => {
//     try {
//         const { brand_name, brand_id } = req.body;
        
//         // ভ্যালিডেশন চেক
//         if (!brand_name || !brand_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "brand_name and brand_id both are required"
//             });
//         }
        
//         // ব্র্যান্ড খুঁজে বের করা (নাম এবং আইডি উভয় মিলিয়ে)
//         const brand = await brandModel.findOne({
//             _id: brand_id,
//             brand_name: brand_name
//         });
        
//         // ব্র্যান্ড exists কিনা চেক
//         if (!brand) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Brand not found with provided name and id"
//             });
//         }
        
//         // ব্র্যান্ড ডিলিট করা
//         const deletedBrand = await brandModel.findByIdAndDelete(brand_id);
        
//         // অপশনাল: এই ব্র্যান্ডের সাথে সম্পর্কিত সব প্রোডাক্টও ডিলিট করতে চাইলে
//         // await productModel.deleteMany({ brand_id: brand_id });
        
//         res.status(200).json({
//             success: true,
//             message: `Brand "${brand_name}" deleted successfully`,
//             deletedData: {
//                 brand_id: deletedBrand._id,
//                 brand_name: deletedBrand.brand_name
//             }
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
const { default: mongoose } = require("mongoose");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

// Create Brand
exports.createBrand = async (req, res) => {
    try {
        const { brand_name, brand_img, category_id } = req.body;
        
        console.log("📝 Creating brand:", { brand_name, category_id });
        
        // Validation
        if (!brand_name) {
            return res.status(400).json({
                success: false,
                message: "Brand name is required"
            });
        }
        
        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }
        
        // Check if category exists
        const category = await categoryModel.findById(category_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        
        // Check if brand already exists in this category
        const existingBrand = await brandModel.findOne({ 
            brand_name: brand_name,
            category_id: category_id 
        });
        
        if (existingBrand) {
            return res.status(400).json({
                success: false,
                message: "Brand already exists in this category"
            });
        }
        
        // Create slug
        const slug = `${category.slug}-${brand_name.toLowerCase().replace(/ /g, '-')}`;
        
        const data = await brandModel.create({
            brand_name,
            brand_img: brand_img || "",
            category_id,
            slug
        });
        
        console.log("✅ Brand created:", data);
        
        // Populate category data
        const populatedData = await brandModel.findById(data._id)
            .populate('category_id', 'category_name slug');
        
        res.status(200).json({
            success: true,
            message: "Brand created successfully",
            data: populatedData
        });
        
    } catch (error) {
        console.error("❌ Create brand error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==================== GET BRANDS BY CATEGORY ====================
exports.getBrandsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        
        console.log("🔍 Fetching brands for category:", category_id);
        
        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }
        
        const brands = await brandModel.find({ 
            category_id: category_id,
            status: true 
        }).select('brand_name _id brand_img slug');
        
        console.log(`📦 Found ${brands.length} brands:`, brands);
        
        res.status(200).json({
            success: true,
            message: "Brands fetched by category",
            data: brands,
            totalCount: brands.length
        });
        
    } catch (error) {
        console.error("❌ Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all brands
exports.all_brand = async (req, res) => {
    try {
        const brands = await brandModel.find({ status: true })
            .populate('category_id', 'category_name slug')
            .sort({ createdAt: -1 });
        
        // Get product count for each brand
        const brandsWithProductCount = await Promise.all(
            brands.map(async (brand) => {
                const productCount = await productModel.countDocuments({ 
                    brand_id: brand._id 
                });
                return {
                    ...brand.toObject(),
                    productCount
                };
            })
        );
        
        res.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            data: brandsWithProductCount,
            totalCount: brandsWithProductCount.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get single brand
exports.single_brand = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await brandModel.findById(id)
            .populate('category_id', 'category_name slug');
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }
        
        // Get products under this brand
        const products = await productModel.find({ brand_id: id })
            .select('title price images remark')
            .limit(10);
        
        res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
            data: {
                ...data.toObject(),
                products,
                productCount: products.length
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get only brand names (for dropdown)
exports.all_brand_single_brand_name = async (req, res) => {
    try {
        const brands = await brandModel.find({ status: true })
            .select('brand_name _id category_id')
            .populate('category_id', 'category_name')
            .sort({ brand_name: 1 });
        
        res.status(200).json({
            success: true,
            message: "Brand names fetched successfully",
            data: brands,
            totalCount: brands.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get brands by category
// exports.getBrandsByCategory = async (req, res) => {
//     try {
//         const { category_id } = req.params;
        
//         const brands = await brandModel.find({ 
//             category_id: category_id,
//             status: true 
//         }).select('brand_name _id brand_img');
        
//         res.status(200).json({
//             success: true,
//             message: "Brands fetched by category",
//             data: brands,
//             totalCount: brands.length
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// Update brand
exports.brand_Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand_name, brand_img, category_id, status } = req.body;
        
        let updateData = {};
        if (brand_name) {
            updateData.brand_name = brand_name;
            // Update slug if category exists
            const currentBrand = await brandModel.findById(id);
            if (currentBrand && currentBrand.category_id) {
                const category = await categoryModel.findById(currentBrand.category_id);
                if (category) {
                    updateData.slug = `${category.slug}-${brand_name.toLowerCase().replace(/ /g, '-')}`;
                }
            }
        }
        if (brand_img !== undefined) updateData.brand_img = brand_img;
        if (category_id) {
            // Check if category exists
            const category = await categoryModel.findById(category_id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }
            updateData.category_id = category_id;
            // Update slug with new category
            if (brand_name) {
                updateData.slug = `${category.slug}-${brand_name.toLowerCase().replace(/ /g, '-')}`;
            }
        }
        if (status !== undefined) updateData.status = status;
        
        const data = await brandModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('category_id', 'category_name slug');
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete brand by ID
exports.brand_Delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if brand has products
        const productsCount = await productModel.countDocuments({ brand_id: id });
        if (productsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete brand. It has ${productsCount} product(s) associated.`
            });
        }
        
        const deleted = await brandModel.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Brand deleted successfully",
            data: deleted
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete brand by name
exports.delete_brand_by_name = async (req, res) => {
    try {
        const { brand_name, brand_id, category_id } = req.body;
        
        if (!brand_name && !brand_id) {
            return res.status(400).json({
                success: false,
                message: "Either brand_name or brand_id is required"
            });
        }
        
        let query = {};
        if (brand_id) {
            query._id = brand_id;
        } else {
            query.brand_name = brand_name;
            if (category_id) query.category_id = category_id;
        }
        
        const brand = await brandModel.findOne(query);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }
        
        // Check if brand has products
        const productsCount = await productModel.countDocuments({ brand_id: brand._id });
        if (productsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete brand. It has ${productsCount} product(s) associated.`
            });
        }
        
        const deleted = await brandModel.findByIdAndDelete(brand._id);
        
        res.status(200).json({
            success: true,
            message: `Brand "${deleted.brand_name}" deleted successfully`,
            data: deleted
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}