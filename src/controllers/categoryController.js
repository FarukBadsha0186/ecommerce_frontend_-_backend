// const { default: mongoose } = require("mongoose");
// const categoryModel = require("../models/categoryModel");

//  exports.category= async ( req, res)=>{
//     try {
//           const {category_name }= req.body;

//            let data= await categoryModel.create({category_name,});
//             res.status(200).json({
//                  success :true,
//                  message: "Category succes succesfully",
//                  data,
//             })
        

//     } catch( error){

//          return res.status(500).json({
//        success: false,
//        message: error.message
//      });

//     }
//  }

// //   exports.all_category= async(req, res)=>{
   
// //     try {

// //     let page_no=Number(req.params.page_no);
// //     let per_page=Number(req.params.per_page);
   
    

// //     let skipRow=(page_no - 1)*per_page;
// //     let shortstage={keyword: -1}


// //  let joinwithProduct={
// //     $lookup:{
// //         from :"products",
// //         localField: "_id",
// //         foreignField:"categoery_id",
// //         as:"products",
// //     },
// //  };

// //  const addProductCount={
// //     $addFields:{
// //         totalProduct :{$size: "$products"},
// //     },
// //  }

// //  let fecetStage={
// //     $facet:{
// //         totalCount: [{$count: "count"}],
// //         categories :[
// //             {$sort :shortstage},
// //             {$skip : skipRow},
// //             {$limit : per_page},
// //             joinwithProduct,
// //             addProductCount,
// //             // {
// //             //     $project:{
// //             //         updatedAt:0,
// //             //         products:0,

// //             //     }
// //             // }
           

// //         ]
// //     }
// //  }

// //  let categories  =await categoryModel.aggregate([fecetStage])
// //     res.status(200).json({
// //         success:true,
// //         message: "Category fetched Succesfully",
// //         data: categories[0]
// //     })


// //     } catch (error) {
        
// //      return res.status(500).json({
// //        success: false,
// //        message: error.message
// //      });
 
        
// //     }
// //  }

// exports.all_category = async (req, res) => {
//     try {
//         // পেজিনেশন ছাড়া সব ক্যাটাগরি fetch করুন
//         let joinwithProduct = {
//             $lookup: {
//                 from: "products",
//                 localField: "_id",
//                 foreignField: "categoery_id",  // ⚠️ চেক করুন: category_id হবে?
//                 as: "products",
//             },
//         };
        
//         const addProductCount = {
//             $addFields: {
//                 totalProduct: { $size: "$products" },
//             },
//         };
        
//         let categories = await categoryModel.aggregate([
//             joinwithProduct,
//             addProductCount,
//             { $sort: { keyword: -1 } }  // সাজানোর জন্য
//         ]);
        
//         res.status(200).json({
//             success: true,
//             message: "Category fetched Successfully",
//             data: categories,  // সরাসরি ডাটা দিন
//             totalCount: categories.length
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
//   exports.single_category = async(req, res)=>{
//     try {
//          const {id}= req.params;
//          let data =await categoryModel.findById(id);

//           return res.status(200).json({
//        success: true,
//        message:  "Category fecthed succes fully",
//        data,
//           });




//     }catch(error){
//           return res.status(500).json({
//        success: false,
//        message: error.message
//      });
 

//     }
//   }

// exports.all_category_single_category_name = async (req, res) => {
//     try {
//         // শুধুমাত্র category_name ফিল্ড প্রজেক্ট করুন
//         const categories = await categoryModel.aggregate([
//             {
//                 $project: {
//                     category_name: 1,  // শুধুমাত্র category_name ফিল্ড নিবে
//                     _id: 0             // _id ফিল্ড বাদ দিবে (চাইলে রাখতে পারেন)
//                 }
//             },
//             { $sort: { category_name: 1 } }  // নাম অনুযায়ী সাজানো (A-Z)
//         ]);
        
//         res.status(200).json({
//             success: true,
//             message: "Category names fetched successfully",
//             data: categories,
//             totalCount: categories.length
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
//    exports.category_Update= async (req, res)=>{
//       try {
//           const id = req.params.id;
  
//         const {  category_name,category_img,} = req.body;
  
  
                    
                  
//      let data = await categoryModel.findByIdAndUpdate(id,{category_name,category_img
      
//      },
//      { new: true}
//   );
//    res.status(200).json({
//                       success :true,
//                       message: "category  updated succesfully",
//                       data,
//                      });
       
  
//       }catch(error){
//             return res.status(500).json({
//          success: false,
//          message: error.message
//        });
   
  
//       }
//    }

//     exports.category_Delete = async (req, res) => {
//      try {
//        const { id } = req.params;
   
//        const deleted = await categoryModel.findByIdAndDelete(id);
   
//        if (!deleted) {
//          return res.status(404).json({
//            success: false,
//            message: "Category not found",
//          });
//        }
   
//        res.status(200).json({
//          success: true,
//          message: "Category deleted successfully",
//          data: deleted,
//        });
   
//      } catch (error) {
//        return res.status(500).json({
//          success: false,
//          message: error.message,
//        });
//      }
//    };

//  exports.delete_category_by_name = async (req, res) => {
//     try {
//         const { category_name, category_id } = req.body; // body থেকে গ্রহণ
        
//         // ভ্যালিডেশন চেক
//         if (!category_name || !category_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "category_name and category_id both are required"
//             });
//         }
        
//         // ক্যাটাগরি খুঁজে বের করা (নাম এবং আইডি উভয় মিলিয়ে)
//         const category = await categoryModel.findOne({
//             _id: category_id,
//             category_name: category_name
//         });
        
//         // ক্যাটাগরি exists কিনা চেক
//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found with provided name and id"
//             });
//         }
        
//         // ক্যাটাগরি ডিলিট করা
//         const deletedCategory = await categoryModel.findByIdAndDelete(category_id);
        
//         // অপশনাল: এই ক্যাটাগরির সাথে সম্পর্কিত সব প্রোডাক্টও ডিলিট করতে চাইলে
//         // await productModel.deleteMany({ categoery_id: category_id });
        
//         res.status(200).json({
//             success: true,
//             message: `Category "${category_name}" deleted successfully`,
//             deletedData: {
//                 category_id: deletedCategory._id,
//                 category_name: deletedCategory.category_name
//             }
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// const { default: mongoose } = require("mongoose");
// const categoryModel = require("../models/categoryModel");

// // ✅ ক্যাটাগরি তৈরি (ফিক্সড)
// exports.category = async (req, res) => {
//     try {
//         const { category_name } = req.body;
        
//         // ভ্যালিডেশন
//         if (!category_name) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Category name is required"
//             });
//         }
        
//         // ডুপ্লিকেট চেক
//         const existingCategory = await categoryModel.findOne({ category_name });
//         if (existingCategory) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Category already exists"
//             });
//         }
        
//         // স্লাগ তৈরি
//         const slug = category_name.toLowerCase().replace(/ /g, '-');
        
//         let data = await categoryModel.create({ 
//             category_name, 
//             slug,
//             keyword: slug
//         });
        
//         // ফ্রন্টেন্ডের জন্য ফরম্যাট করা ডাটা
//         const formattedData = {
//             _id: data._id,
//             name: data.category_name,
//             slug: data.slug
//         };
        
//         res.status(200).json({
//             success: true,
//             message: "Category created successfully",
//             data: formattedData,
//         });
        
//     } catch (error) {
//         // ডুপ্লিকেট এরর হ্যান্ডেল
//         if (error.code === 11000) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Category already exists"
//             });
//         }
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// // ✅ সব ক্যাটাগরি (পেজিনেশন সহ)
// exports.all_category = async (req, res) => {
//     try {
//         let page_no = Number(req.params.page_no);
//         let per_page = Number(req.params.per_page);
        
//         let skipRow = (page_no - 1) * per_page;
//         let sortStage = { keyword: -1 }
        
//         let joinwithProduct = {
//             $lookup: {
//                 from: "products",
//                 localField: "_id",
//                 foreignField: "categoery_id",
//                 as: "products",
//             },
//         };
        
//         const addProductCount = {
//             $addFields: {
//                 totalProduct: { $size: "$products" },
//             },
//         }
        
//         let facetStage = {
//             $facet: {
//                 totalCount: [{ $count: "count" }],
//                 categories: [
//                     { $sort: sortStage },
//                     { $skip: skipRow },
//                     { $limit: per_page },
//                     joinwithProduct,
//                     addProductCount,
//                 ]
//             }
//         }
        
//         let categories = await categoryModel.aggregate([facetStage]);
        
//         res.status(200).json({
//             success: true,
//             message: "Category fetched Successfully",
//             data: categories[0],
//             totalCount: categories[0]?.totalCount[0]?.count || 0
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// // ✅ সব ক্যাটাগরি (পেজিনেশন ছাড়া)
// exports.all_category_without_pagination = async (req, res) => {
//     try {
//         let joinwithProduct = {
//             $lookup: {
//                 from: "products",
//                 localField: "_id",
//                 foreignField: "categoery_id",
//                 as: "products",
//             },
//         };
        
//         const addProductCount = {
//             $addFields: {
//                 totalProduct: { $size: "$products" },
//             },
//         };
        
//         let categories = await categoryModel.aggregate([
//             joinwithProduct,
//             addProductCount,
//             { $sort: { keyword: -1 } }
//         ]);
        
//         res.status(200).json({
//             success: true,
//             message: "Category fetched Successfully",
//             data: categories,
//             totalCount: categories.length
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ✅ সিঙ্গেল ক্যাটাগরি
// exports.single_category = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid category ID"
//             });
//         }
        
//         let data = await categoryModel.findById(id);
        
//         if (!data) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found"
//             });
//         }
        
//         return res.status(200).json({
//             success: true,
//             message: "Category fetched successfully",
//             data: data,
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// // ✅ শুধু ক্যাটাগরির নাম এবং আইডি (CreatableSelect এর জন্য) - ফিক্সড
// exports.all_category_single_category_name = async (req, res) => {
//     try {
//         const categories = await categoryModel.find({}, { category_name: 1, _id: 1, slug: 1 });
        
//         // ফ্রন্টেন্ডের expectations অনুযায়ী ডাটা ফরম্যাট করুন
//         const formattedData = categories.map(cat => ({
//             _id: cat._id,
//             name: cat.category_name,  // ← 'category_name' কে 'name' হিসেবে রিটার্ন করুন
//             slug: cat.slug
//         }));
        
//         res.status(200).json({
//             success: true,
//             message: "Category names fetched successfully",
//             data: formattedData,
//             totalCount: formattedData.length
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ✅ ক্যাটাগরি আপডেট
// exports.category_Update = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { category_name, category_img } = req.body;
        
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid category ID"
//             });
//         }
        
//         // নতুন স্লাগ তৈরি
//         const slug = category_name ? category_name.toLowerCase().replace(/ /g, '-') : undefined;
        
//         let updateData = {};
//         if (category_name) updateData.category_name = category_name;
//         if (slug) updateData.slug = slug;
//         if (category_img) updateData.category_img = category_img;
        
//         let data = await categoryModel.findByIdAndUpdate(
//             id, 
//             updateData,
//             { new: true, runValidators: true }
//         );
        
//         if (!data) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found"
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: "Category updated successfully",
//             data: {
//                 _id: data._id,
//                 name: data.category_name,
//                 slug: data.slug
//             }
//         });
        
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Category name already exists"
//             });
//         }
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// // ✅ ক্যাটাগরি ডিলিট (আইডি দিয়ে) - ফিক্সড
// exports.category_Delete = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid category ID"
//             });
//         }
        
//         const deleted = await categoryModel.findByIdAndDelete(id);
        
//         if (!deleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found",
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: `Category "${deleted.category_name}" deleted successfully`,
//             data: {
//                 _id: deleted._id,
//                 name: deleted.category_name
//             },
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// // ✅ ক্যাটাগরি ডিলিট (নাম এবং আইডি দিয়ে) - ফিক্সড
// exports.delete_category_by_name = async (req, res) => {
//     try {
//         const { category_name, category_id } = req.body;
        
//         // ভ্যালিডেশন চেক
//         if (!category_name && !category_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Either category_name or category_id is required"
//             });
//         }
        
//         let deletedCategory;
        
//         // আইডি দিয়ে ডিলিট
//         if (category_id) {
//             if (!mongoose.Types.ObjectId.isValid(category_id)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid category ID"
//                 });
//             }
//             deletedCategory = await categoryModel.findByIdAndDelete(category_id);
//         } 
//         // নাম দিয়ে ডিলিট
//         else if (category_name) {
//             deletedCategory = await categoryModel.findOneAndDelete({ category_name: category_name });
//         }
        
//         if (!deletedCategory) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found"
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: `Category "${deletedCategory.category_name}" deleted successfully`,
//             data: {
//                 category_id: deletedCategory._id,
//                 category_name: deletedCategory.category_name
//             }
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");

// Create Category
exports.category = async (req, res) => {
    try {
        const { category_name } = req.body;
        
        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }
        
        // Check if category already exists
        const existingCategory = await categoryModel.findOne({ category_name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }
        
        // Create slug
        const slug = category_name.toLowerCase().replace(/ /g, '-');
        
        const data = await categoryModel.create({
            category_name,
            
            slug
        });
        
        res.status(200).json({
            success: true,
            message: "Category created successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get all categories
exports.all_category = async (req, res) => {
    try {
        const categories = await categoryModel.find({ status: true })
            .sort({ createdAt: -1 });
        
        // Get brand count for each category
        const categoriesWithBrandCount = await Promise.all(
            categories.map(async (category) => {
                const brandCount = await brandModel.countDocuments({ 
                    category_id: category._id,
                    status: true 
                });
                return {
                    ...category.toObject(),
                    brandCount
                };
            })
        );
        
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categoriesWithBrandCount,
            totalCount: categoriesWithBrandCount.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get single category
exports.single_category = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await categoryModel.findById(id);
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        
        // Get brands under this category
        const brands = await brandModel.find({ 
            category_id: id,
            status: true 
        }).select('brand_name brand_img');
        
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: {
                ...data.toObject(),
                brands
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get only category names (for dropdown)
exports.all_category_single_category_name = async (req, res) => {
    try {
        const categories = await categoryModel.find({ status: true })
            .select('category_name _id slug')
            .sort({ category_name: 1 });
        
        res.status(200).json({
            success: true,
            message: "Category names fetched successfully",
            data: categories,
            totalCount: categories.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Update category
exports.category_Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, category_img, status } = req.body;
        
        let updateData = {};
        if (category_name) {
            updateData.category_name = category_name;
            updateData.slug = category_name.toLowerCase().replace(/ /g, '-');
        }
        if (category_img !== undefined) updateData.category_img = category_img;
        if (status !== undefined) updateData.status = status;
        
        const data = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete category by ID
exports.category_Delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if category has brands
        const brandsCount = await brandModel.countDocuments({ category_id: id });
        if (brandsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${brandsCount} brand(s) associated. Please delete or reassign brands first.`
            });
        }
        
        const deleted = await categoryModel.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: deleted
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete category by name
exports.delete_category_by_name = async (req, res) => {
    try {
        const { category_name, category_id } = req.body;
        
        if (!category_name && !category_id) {
            return res.status(400).json({
                success: false,
                message: "Either category_name or category_id is required"
            });
        }
        
        let query = {};
        if (category_id) {
            query._id = category_id;
        } else {
            query.category_name = category_name;
        }
        
        // Check if category exists
        const category = await categoryModel.findOne(query);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        
        // Check if category has brands
        const brandsCount = await brandModel.countDocuments({ category_id: category._id });
        if (brandsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${brandsCount} brand(s) associated.`
            });
        }
        
        const deleted = await categoryModel.findByIdAndDelete(category._id);
        
        res.status(200).json({
            success: true,
            message: `Category "${deleted.category_name}" deleted successfully`,
            data: deleted
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}