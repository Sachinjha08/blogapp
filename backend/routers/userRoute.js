const express = require("express");
const {
  register,
  logout,
  login,
  getAllUser,
  deleteUser,
  getUserInfo,
} = require("../controllers/userController");
const upload = require("../middlewares/Multer");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/register", upload.single("profile"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-all-users", isAdmin, getAllUser);
router.get("/user/:id", getUserInfo);
//for admin

router.get("/get-all-users", isAdmin, getAllUser);
router.delete("/delete-user/:id", isAdmin, deleteUser);

module.exports = router;
