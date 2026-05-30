const mongoose=require("mongoose");
const DataSchema=new mongoose.Schema(

    {
          user_id:{type:mongoose.Schema.Types.ObjectID,required:true},
          product_id:{type:mongoose.Schema.Types.ObjectID,required:true},
          invoice_id:{type:String, required:true},
          prodict_name:{type:String, required:true},
          quantity:{type:String, required:true},
          color:{type:String, required:true},
          price:{type:Number ,required:true},
          size:{type: String, required:true}
          
          

    },
    {
         timestamps:true,
           versionKey:false,
    }
);
const invoiceModel= mongoose.model("brands",DataSchema);
module.exports=invoiceModel;