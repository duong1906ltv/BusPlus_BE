import mongoose from "mongoose";

// Định nghĩa schema cho thông tin trạm dừng (station)
const stationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	location: {
		latitude: {
			type: Number,
			required: true,
		},
		longitude: {
			type: Number,
			required: true,
		},
	},
});

export default mongoose.model("Station", stationSchema);
