import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TicketType",
    required: true,
  },
  description: {
    type: String,
  },
  ticketCode: {
    type: String,
    required: true,
    unique: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Ticket", ticketSchema);
