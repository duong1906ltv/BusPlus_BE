import mongoose from "mongoose";

// Định nghĩa schema cho thông tin tuyến xe buýt (route)
const locationSchema = new mongoose.Schema({
	busId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bus",
	},
	lat: {
		type: Number,
		required: true,
	},
	lng: {
		type: Number,
		required: true,
	},
});

export default mongoose.model("Location", locationSchema);
