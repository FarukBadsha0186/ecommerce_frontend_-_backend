const jwt = require("jsonwebtoken");

exports.EncodeToken = (email, _id) => {

    const key = process.env.JWT_KEY;
    const expire = process.env.JWT_EXPIRE_TIME;

    const payload = { email, _id };

    return jwt.sign(payload, key, { expiresIn: expire });
};


exports.DecodeToken = (token) => {

    try {

        const key = process.env.JWT_KEY;

        const decode = jwt.verify(token, key);

        return decode;

    } catch (error) {

        return null;

    }
};