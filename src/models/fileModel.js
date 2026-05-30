const mongoose=require("mongoose");
const DataSchema=new mongoose.Schema(

    {
        
        
          file_name:{type:String},

          

    },
    {
         timestamps:true,
           versionKey:false,
    }
);
const fileModel= mongoose.model("file",DataSchema);
module.exports=fileModel;