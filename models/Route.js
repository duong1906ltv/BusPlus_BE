import mongoose from "mongoose";

// Định nghĩa schema cho thông tin tuyến xe buýt (route)
const routeSchema = new mongoose.Schema({
	routeName: {
		type: String,
		required: true,
		unique: true,
	},
	routeNumber: {
		type: String,
		required: true,
		unique: true,
	},
	cost: {
		type: Number,
		required: true,
	},
	forwardRoute: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Station",
		},
	],
	backwardRoute: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Station",
		},
	],
});

export default mongoose.model("Route", routeSchema);
