const bcrypt = require("bcrypt");
const adminModel=require("../models/adminModel");
const { EncodeToken }= require("../utility/tokenHelper");

const options = {
    httpOnly: true,
    secure: false,        // development এ false
    sameSite: 'lax',      // গুরুত্বপূর্ণ
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
};





exports.register=async(req,res)=>{
    try{

        const {email,password}=req.body;
        await adminModel.create({email,password})
        res.status(200).json({
            succes:true,
            meseage:"Admin create succesfully",
        })
      

    }catch (error){
        res.status(500).json({
            succes:false,
            error:error.toString(),
            massage:"Something went wrong"
        })

    }

}

// exports.login = async (req, res) => {
//     try {

//         const { email, password } = req.body;

//         const user = await adminModel.findOne({ email });

//         if (!user) {
//             return res.status(200).json({
//                 success: false,
//                 message: "Invalid Email or Password"
//             });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(200).json({
//                 success: false,
//                 message: "Invalid Email or Password"
//             });
//         }

//         // ✅ Token Generate
//         const token = EncodeToken({
//             email: user.email,
//             id: user._id.toString()
//         });

//         // ✅ Cookie Set
//         res.cookie("a_token", token, options);

//         return res.status(200).json({
//             success: true,
//             message: "Admin Login Successfully",
//             token: token
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await adminModel.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // ✅ Correct Token Generate
        const token = EncodeToken(user.email, user._id.toString());

        res.cookie("a_token", token, options);

        return res.status(200).json({
            success: true,
            message: "Admin Login Successfully",
            token: token
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



exports.admin = async (req, res) => {
    try {

        let email = req.user.email;

        console.log(email);

        res.status(200).json({
            success: true,
            email: email
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

 exports.adminVerify = async (req, res) => {
     try {

        res.status(200).json({
            succes:true,
        })

     } catch{

         return res.status(500).json({
            success: false,
            message: error.message
        });


     }
 }


 exports.adminlogout= async (req, res) => {
     try {

        res.clearCookie("a_token");
        res.status(200).json({
            succes:true, message:"Logout Succes!"
        });
        }catch{

         return res.status(500).json({
            success: false,
            message: error.message
        });


     }
 }

exports.admin_Update = async (req, res) => {
  try {

    const { email, password } = req.body;

    const _id = req.user._id;

    // user check by id
    const user = await adminModel.findById(_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let updated_Data = {};

    if (email) {
      updated_Data.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updated_Data.password = hashedPassword;
    }

    const updateUser = await adminModel.findByIdAndUpdate(
      _id,
      updated_Data,
      { new: true }
    );

    // new token generate
    let token = EncodeToken(updateUser.email, updateUser._id.toString());

    res.cookie("a_token", token, options);

    res.status(200).json({
      success: true,
      message: "Admin Updated Successfully!",
      user: {
        email: updateUser.email
      }
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



