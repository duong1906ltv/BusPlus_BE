import mongoose from "mongoose";

// Định nghĩa schema cho thông tin xe buýt (bus)
const busSchema = new mongoose.Schema({
	routeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Route",
		required: true,
	},
	busNumber: {
		type: String,
		required: true,
		unique: true,
	},
	// currentStation: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Station",
	// 	required: true,
	// },  // Có thể cần
	driverName: {
		type: String,
		// required: true,
	},
	capacity: {
		type: Number,
		// required: true,
	},
	activeStatus: {
		type: Boolean,
		default: false,
	}
	// createdDate: {
	// 	type: Date,
	// 	default: Date.now,
	// },
});

export default mongoose.model("Bus", busSchema);
