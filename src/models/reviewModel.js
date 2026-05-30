const mongoose=require("mongoose");
const DataSchema=new mongoose.Schema(

    {
          user_id:{type:mongoose.Schema.Types.ObjectID,required:true},
          product_id:{type:mongoose.Schema.Types.ObjectID,required:true},
          invoice_id:{type:mongoose.Schema.Types.ObjectID,required:true},
          description:{type:String, required:true},
          rating:{type:String, required:true},
        
          
          

    },
    {
         timestamps:true,
           versionKey:false,
    }
);
const reviewModel= mongoose.model("review",DataSchema);
module.exports=reviewModel;