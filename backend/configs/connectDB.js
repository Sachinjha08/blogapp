const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("database is connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
