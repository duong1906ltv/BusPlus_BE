import mongoose from "mongoose";

// Định nghĩa schema cho thông tin xe buýt (bus)
const checkInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["CheckIn", "CheckOut"],
  },
  busNumber: {
    type: String,
  },
  routeNumber: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  noti: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CheckIn", checkInSchema);
