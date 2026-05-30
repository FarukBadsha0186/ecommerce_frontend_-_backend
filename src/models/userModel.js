const mongoose=require("mongoose");
const bcrypt= require("bcrypt");
const DataSchema=new mongoose.Schema(
   
    {
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{ type:String,require:true },
     cus_name:{ type:String,require:true },
      cuse_add:{ type:String,require:true },
       cuse_city:{ type:String,require:true },
        cuse_country:{ type:String,require:true },
         cuse_fax:{ type:String,require:true },
          cuse_phone:{ type:String,require:true },
           cuse_postcode:{ type:String,require:true },
          cuse_state:{ type:String,require:true },




          ship_name:{ type:String,require:true },
      ship_add:{ type:String,require:true },
       ship_city:{ type:String,require:true },
        ship_country:{ type:String,require:true },
          ship_phone:{ type:String,require:true },
           ship_postcode:{ type:String,require:true },
          ship_state:{ type:String,require:true },

          
},
    {
        timestamps:true,
           versionKey:false,
    } 
    
);

DataSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
});

const userModel= mongoose.model("users",DataSchema);
module.exports=userModel;