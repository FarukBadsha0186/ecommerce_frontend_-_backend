const bcrypt = require("bcrypt"); // Make sure you have this at the top
const saltRounds = 10; 
const { EncodeToken }= require("../utility/tokenHelper");
const userModel=require("../models/userModel");



let options={

    maxAge: process.env.Cookie_ExpiredTime,
    httpOnly:false,
    sameSite:"none",
    secure:true,
};


exports.user_register = async (req, res) => {
  try {
    const {
      email,
      password,
      cus_name,
      cuse_add,
      cuse_city,
      cuse_country,
      cuse_fax,
      cuse_phone,
      cuse_postcode,
      cuse_state,
      ship_name,
      ship_add,
      ship_city,
      ship_country,
      ship_phone,
      ship_postcode,
      ship_state,
    } = req.body;

    // Check if all required fields are provided
    if (
      !email ||
      !password ||
      !cus_name ||
      !cuse_add ||
      !cuse_city ||
      !cuse_country ||
      !cuse_fax ||
      !cuse_phone ||
      !cuse_postcode ||
      !cuse_state ||
      !ship_name ||
      !ship_add ||
      !ship_city ||
      !ship_country ||
      !ship_phone ||
      !ship_postcode ||
      !ship_state
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for registration",
      });
    }

    // Check if email already exists
    let ifUser = await userModel.findOne({ email });
    if (ifUser) {
      return res.status(200).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create new user with all fields
    let user = await userModel.create({
      email,
      password,
      cus_name,
      cuse_add,
      cuse_city,
      cuse_country,
      cuse_fax,
      cuse_phone,
      cuse_postcode,
      cuse_state,
      ship_name,
      ship_add,
      ship_city,
      ship_country,
      ship_phone,
      ship_postcode,
      ship_state,
    });

    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        email: user.email,
        cus_name: user.cus_name,
        cuse_city: user.cuse_city,
        cuse_country: user.cuse_country,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong",
    });
  }
};



// exports.user_register = async (req, res) => {
//   try {
//     const {
//       email,
//       password,
//       cus_name,
//       cuse_add,
//       cuse_city,
//       cuse_country,
//       cuse_fax,
//       cuse_phone,
//       cuse_postcode,
//       cuse_state,
//       ship_name,
//       ship_add,
//       ship_city,
//       ship_country,
//       ship_phone,
//       ship_postcode,
//       ship_state,
//     } = req.body;

//     // Check if all required fields are provided
//     if (
//       !email ||
//       !password ||
//       !cus_name ||
//       !cuse_add ||
//       !cuse_city ||
//       !cuse_country ||
//       !cuse_fax ||
//       !cuse_phone ||
//       !cuse_postcode ||
//       !cuse_state ||
//       !ship_name ||
//       !ship_add ||
//       !ship_city ||
//       !ship_country ||
//       !ship_phone ||
//       !ship_postcode ||
//       !ship_state
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required for registration",
//       });
//     }

//     // Check if email already exists
//     let ifUser = await userModel.findOne({ email });
//     if (ifUser) {
//       return res.status(200).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     // ✅ HASH THE PASSWORD before storing
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create new user with hashed password
//     let user = await userModel.create({
//       email,
//       password: hashedPassword, // Store the hashed password, not plain text
//       cus_name,
//       cuse_add,
//       cuse_city,
//       cuse_country,
//       cuse_fax,
//       cuse_phone,
//       cuse_postcode,
//       cuse_state,
//       ship_name,
//       ship_add,
//       ship_city,
//       ship_country,
//       ship_phone,
//       ship_postcode,
//       ship_state,
//     });

//     res.status(200).json({
//       success: true,
//       message: "User created successfully",
//       data: {
//         email: user.email,
//         cus_name: user.cus_name,
//         cuse_city: user.cuse_city,
//         cuse_country: user.cuse_country,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.toString(),
//       message: "Something went wrong",
//     });
//   }
// };



// exports.user_login = async (req, res) => {
//     try {

//         const { email, password } = req.body;

//         const user = await userModel.findOne({ email });

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

//         // ✅ Correct Token Generate
//         const token = EncodeToken(user.email, user._id.toString());

//         res.cookie("u_token", token, options);

//         return res.status(200).json({
//             success: true,
//             message: "User Login Successfully",
//             token: token
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }
// };

// exports.user_get = async (req, res) => {
//     try {

//         let email = req.user.email;

//         console.log(email);

//         res.status(200).json({
//             success: true,
//             email: email
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }
// };

exports.user_login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            // Use 401 for authentication failure, not 200
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Debug: Check what's stored
        console.log("Login attempt for:", email);
        console.log("Stored password type:", typeof user.password);
        console.log("Is stored password a bcrypt hash?", user.password?.startsWith('$2b$'));
        
        // Compare the plain text password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Generate token
        const token = EncodeToken(user.email, user._id.toString());
        
        // Set cookie options
        const options = {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
            secure: process.env.NODE_ENV === 'production'
        };
        
        res.cookie("u_token", token, options);

        return res.status(200).json({
            success: true,
            message: "User Login Successfully",
            token: token,
            user: {
                email: user.email,
                name: user.cus_name,
                id: user._id
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.user_get = async (req, res) => {
    try {
        let email = req.user.email;
        
        // Find user with related data (if you have orders collection)
        const user = await userModel.findOne({ email })
            .select('-password')
          
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Format the response with all information
        const userProfile = {
            // Basic Info
            _id: user._id,
            email: user.email,
            cus_name: user.cus_name,
            
            // Billing Information
            cuse_add: user.cuse_add,
            cuse_city: user.cuse_city,
            cuse_state: user.cuse_state,
            cuse_country: user.cuse_country,
            cuse_postcode: user.cuse_postcode,
            cuse_phone: user.cuse_phone,
            cuse_fax: user.cuse_fax,
            
            // Shipping Information
            ship_name: user.ship_name,
            ship_add: user.ship_add,
            ship_city: user.ship_city,
            ship_state: user.ship_state,
            ship_country: user.ship_country,
            ship_postcode: user.ship_postcode,
            ship_phone: user.ship_phone,
            
            // Timestamps
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        res.status(200).json({
            success: true,
            data: userProfile
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
 exports.userVerify = async (req, res) => {
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

  exports.userlogout= async (req, res) => {
     try {

        res.clearCookie("u_token");
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


 exports.user_Update = async (req, res) => {
   try {
 
     const { email, password } = req.body;
 
     const _id = req.user._id;
 
     // user check by id
     const user = await userModel.findById(_id);
 
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
 
     const updateUser = await userModel.findByIdAndUpdate(
       _id,
       updated_Data,
       { new: true }
     );
 
     // new token generate
     let token = EncodeToken(updateUser.email, updateUser._id.toString());
 
     res.cookie("a_token", token, options);
 
     res.status(200).json({
       success: true,
       message: "User Updated Successfully!",
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
