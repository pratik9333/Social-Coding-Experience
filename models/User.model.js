require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [40, "User name is too long"],
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should be atleast 6 char"],
  },
  photo: {
    id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  numberCodingProfiles: {
    type: Number,
    default: 0,
  },
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  friendRequests: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password before save - hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//validate the password with password user sending
userSchema.methods.validatePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password); // doubt in this
};

//create and return JWT token
userSchema.methods.getJwtToken = function () {
  return jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = mongoose.model("User", userSchema);