import Station from "../models/Station.js"; // Import Station model
import Route from "../models/Route.js"; // Import Route model

// Phương thức để lấy danh sách tất cả các trạm xe buýt
const getAllStations = async (req, res) => {
	try {
		const stations = await Station.find(); // Lấy danh sách tất cả các trạm xe buýt từ cơ sở dữ liệu
		res.status(200).json(stations); // Trả về danh sách các trạm xe buýt dưới dạng JSON
	} catch (error) {
		res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
	}
};

const createStation = async (req, res) => {
	const { direction, position, routeNumber } = req.body
	const station = new Station(req.body.station)
	try {
		const newStation = await station.save();
		const route = await Route.findOne({routeNumber})
		if (direction === "FORWARD"){
			route.forwardRoute.splice(position, 0, newStation._id)
		} else if (direction === "BACKWARD") {
			route.backwardRoute.splice(position, 0, newStation._id)
		}
		await route.save()
		return res.status(200).json({ message: "Create new station successfully" });

	} catch (error) {
		res.status(500).json({ error: error.message }); 
	}
};

const createListStation = async (req, res) => {
	try {
		const stations = req.body.stations;
		for (let i = 0; i < stations.length; i++) {
			const station = stations[i];

			// Kiểm tra xem station đã tồn tại trong database chưa
			const existingStation = await Station.findOne({
				name: station.name,
			});
			if (existingStation) {
				continue;
			}

			// Thêm station vào database nếu station chưa tồn tại
			const newStation = new Station({
				name: station.name,
				location: station.location,
			});

			await newStation.save();
		}
		res.json({ message: "Stations added successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
	}
};




const updateStation = async (req, res) => {
	const {name, location} = req.body
	const id = req.params.id;
	try {
		const updateStation = await Station.findByIdAndUpdate(
			id,
			{ $set: { name, location } },
			{ new: true }
		);
		res.json(updateStation);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Phương thức để xóa một tuyến xe buýt
const deleteStation = async (req, res) => {
	const { direction, position, routeNumber } = req.body
	try {
		const route = await Route.findOne({ routeNumber })
		if (direction === "FORWARD") {
			route.forwardRoute.splice(position, 1)
		} else if (direction === "BACKWARD") {
			route.backwardRoute.splice(position, 1)
		}
		await route.save()

		const station = await Station.findByIdAndDelete(req.params.id); // Tìm và xóa xe buýt theo ID
		if (!station) {
			return res.status(404).json({ message: "Station is not found" });
		}
		res.status(200).json({ message: "Delete station successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export {
	getAllStations,
	createStation,
	createListStation,
	updateStation,
	deleteStation,
};
