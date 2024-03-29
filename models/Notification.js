import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["friend check in", "system noti", "admin noti"],
    default: "friend check in",
  },
  status: {
    type: String,
    enum: ["check in", "check out"],
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
  routeNumber: {
    type: String,
  },
  busNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
  },
});

export default mongoose.model("Notification", notificationSchema);
