const mongoose=require("mongoose");
const DataSchema=new mongoose.Schema(

    {
          user_id:{type:mongoose.Schema.Types.ObjectID,required:true},
          product_id:{type:mongoose.Schema.Types.ObjectID,required:true},
          product_name:{type:String, required:true},
          colour:{type:String, required:true},
          size:{type:String, required:true},
          quantity:{type:String, required:true},
          price:{type:Number},
          
          

    },
    {
         timestamps:true,
           versionKey:false,
    }
);
const cardModel= mongoose.model("card",DataSchema);
module.exports=cardModel;