const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide a name"],
        maxlength: [40, "Name should be under 40 characters"],
      },
      email: {
        type: String,
        required: [true, "please provide a email"],
        validate: [validator.isEmail, "please enter email in correct format"],
        trim: true,
        unique: true,
      },
      password: {
        type: String,
        required: [true, "please provide a password"],
        minlength: [6, "PW should be atleast 6 char"],
        select: false, //while bringing pw field will not come, have to explicitly mention
      },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (usersendpassword) {
  return await bcrypt.compare(usersendpassword, this.password);
};

//create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}

module.exports = mongoose.model("User",userSchema)