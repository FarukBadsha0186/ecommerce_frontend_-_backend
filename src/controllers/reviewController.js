const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/reviewModel");

exports.createReview = async (req, res) => {
  try {

    const user_id = req.headers._id;
    const { product_id, invoice_id, description, rating } = req.body;

    const data = await reviewModel.findOneAndUpdate(
      { user_id: user_id, product_id: product_id, invoice_id: invoice_id },
      { user_id, product_id, invoice_id, description, rating },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Review created successfully",
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// exports.all_Review= async(req, res)=>{
    
//      try {
 
//      let page_no=Number(req.params.page_no);
//      let per_page=Number(req.params.per_page);
    
 
//      let skipRow=(page_no - 1)*per_page;
//      let shortstage={createdAt: -1}
 


//       let joinwithUser={
//      $lookup:{
//          from :"users",
//          localField: "user_id",
//          foreignField:"_id",
//          as:"user",
//      },
//   };
 
//   let joinwithProduct={
//      $lookup:{
//          from :"products",
//          localField: "product_id",
//          foreignField:"_id",
//          as:"product",
//      },
//   };


//  let unWindStageUser = {
//   $unwind: {
//     path: "$user",
//     preserveNullAndEmptyArrays: true
//   }
// };

// let unWindStageProduct = {
//   $unwind: {
//     path: "$product",
//     preserveNullAndEmptyArrays: true
//   }
// };
 

 
//   let fecetStage={
//      $facet:{
//          totalCount: [{$count: "count"}],
//          data :[
//              {$sort :shortstage},
//              {$skip : skipRow},
//              {$limit : per_page},
         
//              joinwithUser,
//              joinwithProduct,
//              unWindStageUser,
//              unWindStageProduct,
            
 
//          ]
//      }
//   }
 
//   let data  =await reviewModel.aggregate([fecetStage])
//      res.status(200).json({
//          success:true,
//          message: "Review fetched Succesfully",
//          data: data[0],
//      })
 
 
//      } catch (error) {
         
//       return res.status(500).json({
//         success: false,
//         message: error.message
//       });
  
         
//      }
//   }

exports.all_Review = async (req, res) => {
  try {
    // 👉 Query params
    const page_no = Number(req.query.page_no) || 1;
    const per_page = Number(req.query.per_page) || 10;
    const product_id = req.query.product_id || null; // optional filter

    const skipRow = (page_no - 1) * per_page;

    // 👉 Sorting stage
    const sortStage = { createdAt: -1 };

    // 👉 Lookup user
    const joinWithUser = {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    };

    // 👉 Lookup product
    const joinWithProduct = {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "product",
      },
    };

    // 👉 Unwind
    const unwindUser = {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    };

    const unwindProduct = {
      $unwind: { path: "$product", preserveNullAndEmptyArrays: true },
    };

    // 👉 Match stage for optional product filter
    const matchStage = product_id
      ? { $match: { product_id: new require("mongoose").Types.ObjectId(product_id) } }
      : { $match: {} };

    // 👉 Facet stage
    const facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        data: [
          matchStage,
          { $sort: sortStage },
          { $skip: skipRow },
          { $limit: per_page },
          joinWithUser,
          joinWithProduct,
          unwindUser,
          unwindProduct,
        ],
      },
    };

    const result = await reviewModel.aggregate([facetStage]);
    const data = result[0] || { totalCount: [], data: [] };

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      total: data.totalCount[0] ? data.totalCount[0].count : 0,
      page_no,
      per_page,
      reviews: data.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.single_product_review = async (req, res) => {
    try {
        const { product_id } = req.params;

        // এক product এর সব review fetch
        const reviews = await reviewModel.find({ product_id: product_id });

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
 
    exports.brand_Update= async (req, res)=>{
       try {
           const id = req.params.id;
   
         const { brand_name, brand_img} = req.body;
   
   
                     
                   
      let data = await brandModel.findByIdAndUpdate(id,{brand_name, brand_img
       
      },
      { new: true}
   );
    res.status(200).json({
                       success :true,
                       message: "Brand  updated succesfully",
                       data,
                      });
        
   
       }catch(error){
             return res.status(500).json({
          success: false,
          message: error.message
        });
    
   
       }
    }
 
     exports.brand_Delete = async (req, res) => {
      try {
        const { id } = req.params;
    
        const deleted = await brandModel.findByIdAndDelete(id);
    
        if (!deleted) {
          return res.status(404).json({
            success: false,
            message: "Brand not found",
          });
        }
    
        res.status(200).json({
          success: true,
          message: "Brand deleted successfully",
          data: deleted,
        });
    
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };