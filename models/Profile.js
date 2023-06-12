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
    type: String, // Assuming you store the avatar as a URL or file path
    required: false, // Make it optional if you allow profiles without avatars
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //   },
});

export default mongoose.model("Profile", profileSchema);
