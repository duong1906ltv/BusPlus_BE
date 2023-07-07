import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["friend check in", "admin noti"],
    default: "friend check in",
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  friend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
  }
});

export default mongoose.model("Notification", notificationSchema);
