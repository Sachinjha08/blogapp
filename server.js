const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/connectDB");
const userRoute = require("./routers/userRoute");
const postRoute = require("./routers/postRoute");
const commentRoute = require("./routers/commentRoute");
const PORT = process.env.PORT || 6000;
const path = require("path");

// Connect to Database
connectDB();

// Middlewares
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev")); // Logging middleware
app.use(express.json()); // Parses incoming JSON requests

// CORS Configuration
app.use(cors());
app.options("*", cors()); // Handle preflight requests for all routes

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comment", commentRoute);

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "frontend", "dist")));
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
