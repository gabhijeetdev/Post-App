const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//regural middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//morgan middleware
app.use(morgan("tiny"));
app.use(helmet())

//import all routes here
// const home = require("./routes/home");
const user = require("./routes/user");
const post = require("./routes/post");
const like = require("./routes/like");
const comment = require("./routes/comment")

//router middleware
app.use("/api", user);
app.use("/api/post", post);
app.use("/api/like",like);
app.use("/api/comment",comment)

module.exports = app;