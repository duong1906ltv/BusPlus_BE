import mongoose from "mongoose";

// Định nghĩa schema cho thông tin xe buýt (bus)
const checkInLocationSchema = new mongoose.Schema({
  checkinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CheckIn",
    required: true,
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
});

export default mongoose.model("CheckInLocation", checkInLocationSchema);
