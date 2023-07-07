import mongoose from "mongoose";

const ticketTypeSchema = new mongoose.Schema({
  priority: {
    type: String,
    enum: ["Ưu tiên", "Bình thường"],
    required: true,
  },
  routeType: {
    type: String,
    enum: ["Liên tuyến", "Đơn tuyến"],
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("TicketType", ticketTypeSchema);
