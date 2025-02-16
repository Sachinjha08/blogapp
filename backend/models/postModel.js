const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    dsc: {
      type: String,
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
