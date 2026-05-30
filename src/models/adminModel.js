const mongoose=require("mongoose");
const bcrypt= require("bcrypt");
const DataSchema=new mongoose.Schema(
    {
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
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

const adminModel= mongoose.model("admins",DataSchema);
module.exports=adminModel;