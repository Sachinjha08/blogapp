const express = require("express");
const upload = require("../middlewares/Multer");
const isAdmin = require("../middlewares/isAdmin");
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.post("/create-post", isAdmin, upload.single("image"), createPost);
router.get("/get-post", getPost);
router.patch("/update-post/:id", isAdmin, upload.single("image"), updatePost);
router.delete("/delete-post/:id", isAdmin, deletePost);

module.exports = router;
