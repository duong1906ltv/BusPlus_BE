import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketCode: {
    type: String,
    required: true,
    unique: true,
  },
  priority: {
    type: String,
    enum: ["ưu tiên", "không ưu tiên"],
    default: "",
  },
  ticketType: {
    type: String,
    enum: ["liên tuyến", "một tuyến"],
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Ticket", ticketSchema);
