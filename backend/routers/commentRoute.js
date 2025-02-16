const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { comment } = require("../controllers/commentController");

const router = express.Router();

router.post("/comment", comment);
module.exports = router;
