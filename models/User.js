import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const ADMIN = "ADMIN"
export const PASSENGER = "PASSENGER"

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    default: PASSENGER,
  },
  fullname: {
    type: String,
    // required: [true, "Please provide name"],
    trim: true,
  },
  phone: {
    type: String,
    // required: [true, "Please provide phone number"],
    validate: {
      validator: validator.isNumeric,
      message: "Please provide a phone number",
    },
    unique: true,
    minlength: 10,
    maxlength: 11,
  },
  email: {
    type: String,
    // required: [true, "Please provide phone number"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    select: false,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  deletedAt: {
    type: Date,
  },
});


UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};



export default mongoose.model("User", UserSchema);
