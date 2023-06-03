import Bus from "../models/Bus.js";
import Location from "../models/Location.js";

const createLocation = async (req, res) => {
	try {
		const busId = await Bus.findOne({ busNumber: req.body.busNumber });
		if (!busId) {
			return res.status(400).json({ message: "Bus not found" });
		}
		const { lat, lng } = req.body;
		const location = new Location({
			busId,
			lat,
			lng,
		});
		await location.save();
		res.status(201).json(location);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getAllLocations = async (req, res) => {
	try {
		const locations = await Location.find();
		res.status(200).json(locations);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getLocationById = async (req, res) => {
	try {
		const { id } = req.params;
		const location = await Location.findById(id);
		if (!location) {
			return res.status(404).json({ message: "Location not found" });
		}
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const updateLocationById = async (req, res) => {
	try {
		const { id } = req.params;
		const { busId, lat, lng } = req.body;
		const location = await Location.findById(id);
		if (!location) {
			return res.status(404).json({ message: "Location not found" });
		}
		location.busId = busId;
		location.lat = lat;
		location.lng = lng;
		await location.save();
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const deleteLocationById = async (req, res) => {
	try {
		const { id } = req.params;
		const location = await Location.findByIdAndDelete(id);
		if (!location) {
			return res.status(404).json({ message: "Location not found" });
		}
		res.status(204).json();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getLocationsByBusId = async (req, res) => {
	const { busId } = req.params;

	try {
		const locations = await Location.find({ busId });
		res.status(200).json(locations);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateLocationOfBus = async (req, res) => {
	try {
		const busId = await Bus.findOne({ busNumber: req.body.busNumber });
		if (!busId) {
			return res.status(400).json({ message: "Bus not found" });
		}
		const { lat, lng } = req.body;
		const location = await Location.findOne({ busId: busId });
		if (!location) {
			return res.status(404).json({ message: "Location not found" });
		}
		location.busId = busId;
		location.lat = lat;
		location.lng = lng;
		await location.save();
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Giả lập dữ liệu vị trí của bus
const simulateBusLocation = async(req, res) => {
	const busNumber = req.body.busNumber;
	const busId = await Bus.findOne({ busNumber: req.body.busNumber });
	if (!busId) {
		return res.status(400).json({ message: "Bus not found" });
	}
	const location = await Location.findOne({busId: busId})
	const initialLat = location.lat; // Vị trí ban đầu của bus (Latitude)
	const initialLng = location.lng; // Vị trí ban đầu của bus (Longitude)
  
	let lat = initialLat;
	let lng = initialLng;
  
	// Tạo interval để cập nhật vị trí liên tục (mỗi 5 giây)
	setInterval(async () => {
	  // Tính toán vị trí mới dựa trên vị trí hiện tại và một khoảng cách giả lập
	  const deltaLat = 0.001; 
	  const deltaLng = 0.000001; 
  
	  lat -= deltaLat;
	//   lng += deltaLng;
  
	  // Tạo đối tượng location mới
		location.lat = lat;
		location.lng = lng;
		await location.save()

	}, 1000); // Cập nhật vị trí mỗi 5 giây
  }

export {
	getAllLocations,
	getLocationById,
	getLocationsByBusId,
	createLocation,
	updateLocationById,
	deleteLocationById,
	simulateBusLocation,
	updateLocationOfBus,
};
