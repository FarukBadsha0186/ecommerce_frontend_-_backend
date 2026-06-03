const { DecodeToken } = require("../utility/tokenHelper");

module.exports = (req, res, next) => {
    
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "No token provided",
        });
    }

    let decoded = DecodeToken(token);

    if (decoded == null) {
        return res.status(401).json({
            status: 401,
            message: "Invalid token",
        });
    }

    req.user = {
        email: decoded.email,
        _id: decoded._id
    };

    next();
};