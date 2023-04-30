import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
	route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
	departureTime: [
		{
			type: String,
			required: true,
		},
	],
	arrivalTime: [
		{
			type: String,
			required: true,
		},
	],
});

export default mongoose.model("Schedule", scheduleSchema);
