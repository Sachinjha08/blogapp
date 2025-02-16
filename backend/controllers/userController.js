const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middlewares/Multer");
const mongoose = require("mongoose");
exports.register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;
    const newUser = new userModel({
      userName,
      email,
      password: hashPassword,
      profile: imgPath,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error during registration",
      error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const checkUser = await userModel.findOne({ email });
    if (!checkUser) {
      return res.status(409).json({
        success: false,
        message: "email not found",
      });
    }
    const comparePassword = await bcrypt.compare(password, checkUser.password);
    if (!comparePassword) {
      return res.status(409).json({
        success: false,
        message: "password is wrong",
      });
    }
    const token = jwt.sign({ userId: checkUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3 * 24 * 1000 * 3600,
    });
    return res.status(201).json({
      success: true,
      message: "Login Successful",
      user: checkUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error during login",
      error,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(201).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error during logout",
      error,
    });
  }
};
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User information retrieved successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

//for admin
exports.getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users) {
      return res.status(409).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Login Successful",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUser = await userModel.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(409).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User Deleted",
      deleteUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
