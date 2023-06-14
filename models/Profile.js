import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: Boolean,
    required: false,
    default: false,
  },
  address: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  friends: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["active", "freezed"],
        default: "active",
      },
    },
  ],
});

export default mongoose.model("Profile", profileSchema);
