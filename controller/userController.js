const User = require("../model/user");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const filUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const bigPromise = require("../middleware/bigPromise");
const crypto = require("crypto");

exports.signup = bigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    return next(new CustomError("Name is Required", 400));
  }

  if (!email) {
    return next(new CustomError("Email is Required", 400));
  }

  if (!password) {
    return next(new CustomError("Password is Required", 400));
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    cookieToken(user, res, "User Created");
  } catch (error) {
    return next(new CustomError(error.message, 400));
  }
});

exports.login = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  //check for presence of email and password
  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }

  //get user from db
  const user = await User.findOne({ email }).select("+password");

  //if user not found in db
  if (!user) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }

  const ispassword = await user.isValidatedPassword(password);

  //if password dont match
  if (!ispassword) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }

  //if all goes good we will send the token
  cookieToken(user, res, "Successfully logged-In");
});

exports.logout = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout",
  });
});
