// const { default: mongoose } = require("mongoose");
// const cardModel = require("../models/cardModel");
// const productdModel = require("../models/productModel");
// const categoryModel = require("../models/categoryModel");
// const ObjectId = mongoose.Types.ObjectId;

// //  exports.cartCreate =async(req,res)=>{
// //      try {

// //          let user_id=req.header._id;


// //         const {product_id, product_name,colour,size,quantity}= req.body;

// //         let product=await productdModel.findById(product_id);
// //         let existingCart =await cardModel.findOne({

// //             user_id,product_id, product_name,colour,size,

// //         });

// //          if (!!existingCart == true){
// //             let newReqBody ={
// //                 user_id,product_id, product_name,colour,size,
// //                 quantity: parseInt(existingCart.quantity)+parseInt(quantity), 


// //             }
// //         const carts=await cardModel.find({product_id}).select("quantity");

// //         const  totalQuantity = carts.reduce((sum,item)=> sum+item.quantity,0);

// //        if (product?.stock<totalQuantity+ quantity){
// //          return res.status(200).json({
// //             success: false,
// //             messsage: "You have added all products in stock",
// //          });
// //        }

// //        let updateData= await cardModel.updateOne({
// //         _id:existingCart._id,
// //         user_id:existingCart.user_id,
// //      },{$set :newReqBody});

// //       res.status(200).json({
// //         success:true,
// //         messsage:"Cart Update",
// //         updateData,
// //       });
     


// //          } else {

// //             let carts= await cardModel.find({product_id}).select("quantity");
// //              const  totalQuantity = carts.reduce((sum,item)=> sum+item.quantity,0);
             
// //        if (product?.stock<totalQuantity+ quantity){
// //          return res.status(200).json({
// //             success: false,
// //             messsage: "You have added all products in stock",
// //          });
// //        }

// //         const data= await cardModel.create({
// //             user_id,product_id, product_name,colour,size,quantity,
            

// //         });
// //         res.status(200).json({
// //             success: true,
// //             messsage: "You  add to cart Succesfully",
// //          });

             


// //          }

// //      } catch( error){
// //         return res.status(500).json({
// //          success: false,
// //          message: error.message,
// //        });

// //      }
// //  }

// // exports.cartCreate = async (req,res)=>{
// //  try {

// //    let user_id = req.headers._id;

// //    const {product_id, product_name, colour, size, quantity} = req.body;

// //    let product = await productdModel.findById(product_id);

// //    let existingCart = await cardModel.findOne({
// //       user_id, product_id, product_name, colour, size
// //    });

// //    if(existingCart){

// //       let newReqBody = {
// //          user_id,
// //          product_id,
// //          product_name,
// //          colour,
// //          size,
// //          quantity: parseInt(existingCart.quantity) + parseInt(quantity)
// //       }

// //       let carts = await cardModel.find({product_id}).select("quantity");

// //       const totalQuantity = carts.reduce(
// //          (sum,item)=> sum + parseInt(item.quantity),0
// //       );

// //       if(product?.stock < totalQuantity + quantity){
// //          return res.status(200).json({
// //             success:false,
// //             message:"You have added all products in stock"
// //          });
// //       }

// //       let updateData = await cardModel.updateOne(
// //          {_id:existingCart._id},
// //          {$set:newReqBody}
// //       );

// //       return res.json({
// //          success:true,
// //          message:"Cart Updated"
// //       });

// //    } else {

// //       let carts = await cardModel.find({product_id}).select("quantity");

// //       const totalQuantity = carts.reduce(
// //          (sum,item)=> sum + parseInt(item.quantity),0
// //       );

// //       if(product?.stock < totalQuantity + quantity){
// //          return res.json({
// //             success:false,
// //             message:"You have added all products in stock"
// //          });
// //       }

// //       const data= await cardModel.create({
// //          user_id, product_id, product_name, colour, size, quantity
// //       });

// //       return res.json({
// //          success:true,
// //          message:"Add to cart successfully",
// //          data,


// //       });

// //    }

// //  } catch(error){
// //    return res.status(500).json({
// //       success:false,
// //       message:error.message
// //    });
// //  }
// // }
// // exports.cartCreate = async (req, res) => {
// //   try {
// //     // Better way to get user_id - check multiple sources
// //     let user_id = req.headers._id || req.headers.user_id || req.headers['user-id'] || req.user?._id || req.userId;
    
// //     // Validate user_id exists
// //     if (!user_id) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "User not authenticated. Please login again."
// //       });
// //     }

// //     const { product_id, product_name, colour, size, quantity } = req.body;
    
// //     // Validate required fields
// //     if (!product_id || !quantity) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Product ID and quantity are required"
// //       });
// //     }

// //     let product = await productdModel.findById(product_id);
    
// //     // Check if product exists
// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Product not found"
// //       });
// //     }

// //     let existingCart = await cardModel.findOne({
// //       user_id, 
// //       product_id, 
// //       product_name, 
// //       colour, 
// //       size
// //     });

// //     if (existingCart) {
// //       let newQuantity = parseInt(existingCart.quantity) + parseInt(quantity);
      
// //       // Check stock for update
// //       let carts = await cardModel.find({ product_id }).select("quantity");
// //       const totalQuantity = carts.reduce(
// //         (sum, item) => sum + parseInt(item.quantity), 0
// //       );
      
// //       // Adjust total quantity calculation for update scenario
// //       const otherCartsTotal = totalQuantity - parseInt(existingCart.quantity);
      
// //       if (product.stock < otherCartsTotal + newQuantity) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "Cannot add more items. Insufficient stock available."
// //         });
// //       }

// //       let updateData = await cardModel.updateOne(
// //         { _id: existingCart._id },
// //         { $set: { quantity: newQuantity } }
// //       );

// //       return res.json({
// //         success: true,
// //         message: "Cart Updated successfully"
// //       });

// //     } else {
// //       // Check stock for new cart item
// //       let carts = await cardModel.find({ product_id }).select("quantity");
// //       const totalQuantity = carts.reduce(
// //         (sum, item) => sum + parseInt(item.quantity), 0
// //       );

// //       if (product.stock < totalQuantity + parseInt(quantity)) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "Insufficient stock available"
// //         });
// //       }

// //       const data = await cardModel.create({
// //         user_id, 
// //         product_id, 
// //         product_name, 
// //         colour, 
// //         size, 
// //         quantity: parseInt(quantity)
// //       });

// //       return res.status(201).json({
// //         success: true,
// //         message: "Added to cart successfully",
// //         data
// //       });
// //     }

// //   } catch (error) {
// //     console.error("Cart creation error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message || "Internal server error"
// //     });
// //   }
// // }

// exports.cartCreate = async (req, res) => {
//   try {
//     // Better way to get user_id - check multiple sources
//     let user_id = req.headers._id || req.headers.user_id || req.headers['user-id'] || req.user?._id || req.userId;
    
//     // Validate user_id exists
//     if (!user_id) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated. Please login again."
//       });
//     }

//     const { product_id, product_name, colour, size, quantity } = req.body;
    
//     // ✅ Validate required fields (allow quantity 0 for delete)
//     if (!product_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID is required"
//       });
//     }
    
//     if (quantity === undefined || quantity === null) {
//       return res.status(400).json({
//         success: false,
//         message: "Quantity is required"
//       });
//     }

//     // ✅ NEW: If quantity is 0, delete the item from cart
//     if (parseInt(quantity) === 0) {
//       const deletedItem = await cardModel.findOneAndDelete({
//         user_id: user_id,
//         product_id: product_id
//       });
      
//       if (deletedItem) {
//         return res.status(200).json({
//           success: true,
//           message: "Item removed from cart successfully",
//           deleted: true
//         });
//       } else {
//         // Item not found, but that's fine - return success anyway
//         return res.status(200).json({
//           success: true,
//           message: "Item already removed from cart",
//           deleted: false
//         });
//       }
//     }

//     // ✅ Rest of the code only for quantity > 0
//     let product = await productdModel.findById(product_id);
    
//     // Check if product exists
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     let existingCart = await cardModel.findOne({
//       user_id, 
//       product_id, 
//       product_name, 
//       colour, 
//       size
//     });

//     if (existingCart) {
//       let newQuantity = parseInt(existingCart.quantity) + parseInt(quantity);
      
//       // Check stock for update
//       let carts = await cardModel.find({ product_id }).select("quantity");
//       const totalQuantity = carts.reduce(
//         (sum, item) => sum + parseInt(item.quantity), 0
//       );
      
//       // Adjust total quantity calculation for update scenario
//       const otherCartsTotal = totalQuantity - parseInt(existingCart.quantity);
      
//       if (product.stock < otherCartsTotal + newQuantity) {
//         return res.status(400).json({
//           success: false,
//           message: "Cannot add more items. Insufficient stock available."
//         });
//       }

//       let updateData = await cardModel.updateOne(
//         { _id: existingCart._id },
//         { $set: { quantity: newQuantity } }
//       );

//       return res.json({
//         success: true,
//         message: "Cart Updated successfully"
//       });

//     } else {
//       // Check stock for new cart item
//       let carts = await cardModel.find({ product_id }).select("quantity");
//       const totalQuantity = carts.reduce(
//         (sum, item) => sum + parseInt(item.quantity), 0
//       );

//       if (product.stock < totalQuantity + parseInt(quantity)) {
//         return res.status(400).json({
//           success: false,
//           message: "Insufficient stock available"
//         });
//       }

//       const data = await cardModel.create({
//         user_id, 
//         product_id, 
//         product_name, 
//         colour, 
//         size, 
//         quantity: parseInt(quantity)
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Added to cart successfully",
//         data
//       });
//     }

//   } catch (error) {
//     console.error("Cart creation error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };
















// //chat gpt 
// // exports.cartRead = async (req,res)=>{
// //    try {

// //       let user_id = req.headers._id;

// //       let data = await cardModel.find({user_id});

// //       res.status(200).json({
// //          success:true,
// //          message:"Cart List",
// //          data:data
// //       });

// //    } catch(error){
// //       res.status(500).json({
// //          success:false,
// //          message:error.message
// //       });
// //    }
// // }

// // exports.cartRead = async (req, res) => {
// //   try {
// //     let user_id = req.headers._id;
    
// //     console.log('Cart Read - User ID:', user_id);

// //     if (!user_id) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "User ID required"
// //       });
// //     }

// //     // এগ্রিগেশন ব্যবহার করে প্রোডাক্টের সাথে জয়েন করুন
// //     const mongoose = require("mongoose");
// //     const ObjectId = mongoose.Types.ObjectId;
    
// //     let data = await cardModel.aggregate([
// //       {
// //         $match: { user_id: new ObjectId(user_id) }
// //       },
// //       {
// //         $lookup: {
// //           from: "products",
// //           localField: "product_id",
// //           foreignField: "_id",
// //           as: "product_info"
// //         }
// //       },
// //       {
// //         $addFields: {
// //           product_image: { $arrayElemAt: ["$product_info.images", 0] },
// //           product_price: { $arrayElemAt: ["$product_info.price", 0] }
// //         }
// //       },
// //       {
// //         $project: {
// //           _id: 1,
// //           product_id: 1,
// //           name: "$product_name",
// //           price: { $ifNull: ["$price", "$product_price", 0] },
// //           quantity: { $toInt: "$quantity" },
// //           colour: 1,
// //           size: 1,
// //           image: { $ifNull: ["$product_image", "https://via.placeholder.com/80x80?text=No+Image"] }
// //         }
// //       }
// //     ]);

// //     res.status(200).json({
// //       success: true,
// //       message: "Cart List",
// //       data: data,
// //       totalItems: data.length
// //     });

// //   } catch (error) {
// //     console.error('Cart Read Error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };


// exports.cartRead = async (req, res) => {
//   try {
//     let user_id = req.headers._id;
    
//     console.log('Cart Read - User ID:', user_id);
//     console.log('User ID Type:', typeof user_id);

//     if (!user_id) {
//       return res.status(401).json({
//         success: false,
//         message: "User ID required"
//       });
//     }

//     const mongoose = require("mongoose");
    
//     // ✅ চেক করুন user_id valid ObjectId কিনা
//     let isValidObjectId = mongoose.Types.ObjectId.isValid(user_id);
//     console.log('Is Valid ObjectId:', isValidObjectId);
    
//     let matchCondition = {};
    
//     if (isValidObjectId) {
//       // যদি ObjectId হয়
//       matchCondition = { user_id: new mongoose.Types.ObjectId(user_id) };
//     } else {
//       // যদি স্ট্রিং হয়
//       matchCondition = { user_id: user_id };
//     }
    
//     let data = await cardModel.aggregate([
//       {
//         $match: matchCondition
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "product_id",
//           foreignField: "_id",
//           as: "product_info"
//         }
//       },
//       {
//         $addFields: {
//           product_image: { $arrayElemAt: ["$product_info.images", 0] },
//           product_price: { $arrayElemAt: ["$product_info.price", 0] },
//           // ✅ quantity কে number এ কনভার্ট করুন
//           quantity_num: { $toInt: "$quantity" }
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           product_id: 1,
//           name: "$product_name",
//           price: { $ifNull: ["$price", "$product_price", 0] },
//           quantity: { $ifNull: ["$quantity_num", 1] },
//           colour: 1,
//           size: 1,
//           image: { $ifNull: ["$product_image", "https://via.placeholder.com/80x80?text=No+Image"] }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       message: "Cart List",
//       data: data,
//       totalItems: data.length
//     });

//   } catch (error) {
//     console.error('Cart Read Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// exports.cartdelete = async (req, res) => {
//     try {
//         const { product_id } = req.params;
//         const user_id = req.headers['_id'] || req.user?.id;
        
//         if (!user_id) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User ID is required'
//             });
//         }
        
//         if (!product_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Product ID is required'
//             });
//         }
        
//         // cardModel ব্যবহার করুন (Cart এর পরিবর্তে)
//         const deletedItem = await cardModel.findOneAndDelete({
//             user_id: user_id,
//             product_id: product_id
//         });
        
//         if (!deletedItem) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found in cart'
//             });
//         }
        
//         // বাকি কার্ট আইটেমগুলো দেখান
//         const remainingCart = await cardModel.find({ user_id: user_id });
        
//         res.status(200).json({
//             success: true,
//             message: 'Item removed from cart successfully',
//             data: remainingCart,
//             deletedItem: deletedItem
//         });
        
//     } catch (error) {
//         console.error('Error in cartdelete:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };

// // ==================== CLEAR ALL CART ITEMS ====================
// exports.all_cart_clear = async (req, res) => {
//     try {
//         const user_id = req.headers['_id'] || req.user?.id;
        
//         if (!user_id) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User ID is required'
//             });
//         }
        
//         // cardModel ব্যবহার করুন
//         const deletedItems = await cardModel.deleteMany({ user_id: user_id });
        
//         if (deletedItems.deletedCount === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No items found in cart to clear'
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: `Successfully cleared ${deletedItems.deletedCount} item(s) from cart`,
//             deletedCount: deletedItems.deletedCount
//         });
        
//     } catch (error) {
//         console.error('Error in all_carrt_clear:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };

// // ==================== DELETE BY CART ITEM ID ====================
// exports.deleteByCartId = async (req, res) => {
//     try {
//         const { cart_id } = req.params;
//         const user_id = req.headers['_id'] || req.user?.id;
        
//         if (!user_id) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User ID is required'
//             });
//         }
        
//         // cardModel ব্যবহার করুন
//         const deletedItem = await cardModel.findOneAndDelete({
//             _id: cart_id,
//             user_id: user_id
//         });
        
//         if (!deletedItem) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Cart item not found'
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: 'Cart item deleted successfully',
//             data: deletedItem
//         });
        
//     } catch (error) {
//         console.error('Error in deleteByCartId:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// };

// // ==================== UPDATE CART ITEM QUANTITY ====================
// exports.updateCartQuantity = async (req, res) => {
//     try {
//         const { product_id } = req.params;
//         const { quantity } = req.body;
//         const user_id = req.headers['_id'] || req.user?.id;
        
//         if (!user_id) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User ID is required'
//             });
//         }
        
//         if (quantity === undefined) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Quantity is required'
//             });
//         }
        
//         if (quantity === 0) {
//             // যদি quantity 0 হয়, তাহলে আইটেম ডিলিট করুন
//             return exports.cartdelete(req, res);
//         }
        
//         // cardModel ব্যবহার করুন
//         const updatedCart = await cardModel.findOneAndUpdate(
//             { user_id: user_id, product_id: product_id },
//             { quantity: quantity },
//             { new: true }
//         );
        
//         if (!updatedCart) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found in cart'
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: 'Cart updated successfully',
//             data: updatedCart
//         });
        
//     } catch (error) {
//         console.error('Error in updateCartQuantity:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// };


const { default: mongoose } = require("mongoose");
const cardModel = require("../models/cardModel");
const productdModel = require("../models/productModel");
const ObjectId = mongoose.Types.ObjectId;

// ==================== ADD TO CART ====================
exports.cartCreate = async (req, res) => {
  try {
    // 🔥 Token middleware থেকে user_id নিন
    
     const user_id = req.user?._id; 
    
    const { product_id, product_name, colour, size, quantity } = req.body;
    
    // Validate required fields
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }
    
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required"
      });
    }

    // If quantity is 0, delete the item
    if (parseInt(quantity) === 0) {
      const deletedItem = await cardModel.findOneAndDelete({
        user_id: user_id,
        product_id: product_id
      });
      
      return res.status(200).json({
        success: true,
        message: deletedItem ? "Item removed from cart" : "Item not found in cart",
        deleted: !!deletedItem
      });
    }

    // Get product details
    let product = await productdModel.findById(product_id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if item already exists in cart
    let existingCart = await cardModel.findOne({
      user_id: user_id, 
      product_id: product_id
    });

    if (existingCart) {
      // Update existing cart item
      let newQuantity = parseInt(existingCart.quantity) + parseInt(quantity);
      
      // Check stock availability
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      await cardModel.updateOne(
        { _id: existingCart._id },
        { $set: { quantity: newQuantity } }
      );

      return res.json({
        success: true,
        message: "Cart updated successfully"
      });

    } else {
      // Create new cart item
      if (product.stock < parseInt(quantity)) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      await cardModel.create({
        user_id: user_id, 
        product_id: product_id, 
        product_name: product_name || product.title,
        colour: colour || '',
        size: size || '', 
        quantity: parseInt(quantity),
        price: product.price
      });

      return res.status(201).json({
        success: true,
        message: "Added to cart successfully"
      });
    }

  } catch (error) {
    console.error("Cart creation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// ==================== READ CART ====================
exports.cartRead = async (req, res) => {
  try {
    // 🔥 এখন req.user_id পাওয়া যাবে
    const user_id = req.user_id;
    
    console.log('=== CART READ ===');
    console.log('req.user_id:', user_id);
    console.log('req.user:', req.user);
    
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    
    // Convert to string if needed
    const userIdStr = user_id.toString();
    console.log('Searching for user_id:', userIdStr);
    
    // Get cart items with product details
    let cartItems = await cardModel.find({ user_id: userIdStr });
    console.log('Found cart items:', cartItems.length);
    
    if (cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart retrieved successfully",
        data: [],
        summary: {
          total_items: 0,
          subtotal: 0,
          delivery_charge: 60,
          total: 60
        }
      });
    }
    
    // Get product details for each cart item
    let enrichedCart = await Promise.all(cartItems.map(async (item) => {
      const product = await productdModel.findById(item.product_id);
      
      if (!product) {
        console.log('Product not found for ID:', item.product_id);
        return null;
      }
      
      // Get image URL
      let imageUrl = 'https://via.placeholder.com/80x80?text=No+Image';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].startsWith('http') 
          ? product.images[0] 
          : `http://localhost:5000${product.images[0]}`;
      }
      
      // Calculate price with discount
      let finalPrice = product.price;
      if (product.is_discount && product.discount_price) {
        finalPrice = product.discount_price;
      }
      
      return {
        _id: item._id,
        product_id: item.product_id,
        name: product.title,
        price: finalPrice,
        original_price: product.price,
        quantity: parseInt(item.quantity),
        colour: item.colour || '',
        size: item.size || '',
        image: imageUrl,
        stock: product.stock,
        is_discount: product.is_discount,
        discount_percentage: product.is_discount && product.discount_price 
          ? Math.round(((product.price - product.discount_price) / product.price) * 100)
          : 0
      };
    }));
    
    // Remove null items (where product not found)
    enrichedCart = enrichedCart.filter(item => item !== null);
    
    // Calculate summary
    const summary = enrichedCart.reduce((acc, item) => {
      acc.total_items += item.quantity;
      acc.subtotal += item.price * item.quantity;
      return acc;
    }, { total_items: 0, subtotal: 0 });
    
    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: enrichedCart,
      summary: {
        total_items: summary.total_items,
        subtotal: summary.subtotal,
        delivery_charge: 60,
        total: summary.subtotal + 60
      }
    });

  } catch (error) {
    console.error('Cart Read Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// ==================== UPDATE CART ITEM QUANTITY ====================
exports.updateCartQuantity = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;
    // 🔥 Token middleware থেকে user_id নিন
    const user_id = req.user_id;
    
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }
    
    // If quantity is 0, delete the item
    if (parseInt(quantity) === 0) {
      const deletedItem = await cardModel.findOneAndDelete({
        user_id: user_id,
        product_id: product_id
      });
      
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart'
      });
    }
    
    // Check stock availability
    const product = await productdModel.findById(product_id);
    if (product && product.stock < parseInt(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`
      });
    }
    
    // Update quantity
    const updatedCart = await cardModel.findOneAndUpdate(
      { user_id: user_id, product_id: product_id },
      { quantity: parseInt(quantity) },
      { new: true }
    );
    
    if (!updatedCart) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: updatedCart
    });
    
  } catch (error) {
    console.error('Error in updateCartQuantity:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== DELETE BY PRODUCT ID ====================
exports.cartdelete = async (req, res) => {
  try {
    const { product_id } = req.params;
    // 🔥 Token middleware থেকে user_id নিন
    const user_id = req.user_id;
    
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const deletedItem = await cardModel.findOneAndDelete({
      user_id: user_id,
      product_id: product_id
    });
    
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully'
    });
    
  } catch (error) {
    console.error('Error in cartdelete:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== DELETE BY CART ID ====================
exports.deleteByCartId = async (req, res) => {
  try {
    const { cart_id } = req.params;
    // 🔥 Token middleware থেকে user_id নিন
    const user_id = req.user_id;
    
    const deletedItem = await cardModel.findOneAndDelete({
      _id: cart_id,
      user_id: user_id
    });
    
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cart item deleted successfully'
    });
    
  } catch (error) {
    console.error('Error in deleteByCartId:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== CLEAR ALL CART ITEMS ====================
exports.all_cart_clear = async (req, res) => {
  try {
    // 🔥 Token middleware থেকে user_id নিন
    const user_id = req.user_id;
    
    const deletedItems = await cardModel.deleteMany({ user_id: user_id });
    
    if (deletedItems.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No items found in cart to clear'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Successfully cleared ${deletedItems.deletedCount} item(s) from cart`,
      deletedCount: deletedItems.deletedCount
    });
    
  } catch (error) {
    console.error('Error in all_cart_clear:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};