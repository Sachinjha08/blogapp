const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log("token", token);
    if (!token) {
      return res.status(409).json({
        success: false,
        message: "cookie expires",
      });
    }
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    // console.log(user);
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "user not found",
      });
    }
    if (user.role != "Admin") {
      return res.status(409).json({
        success: false,
        message: "only admin permission",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error on Auth",
      error,
    });
  }
};
module.exports = isAdmin;
