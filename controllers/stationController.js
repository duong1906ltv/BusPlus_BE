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

// Phương thức để tạo một trạm xe buýt mới
const createStation = async (req, res) => {
	try {
		const newStation = new Station(req.body); // Tạo đối tượng Route mới từ dữ liệu gửi lên từ client
		await newStation.save(); // Lưu đối tượng Route mới vào cơ sở dữ liệu
		res.status(201).json(newStation); // Trả về đối tượng Route mới đã được tạo dưới dạng JSON
	} catch (error) {
		res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
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
				console.log(`Station ${station.name} already exists`);
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

// Phương thức để cập nhật thông tin của một tuyến xe buýt
const updateRoute = async (req, res) => {
	try {
		const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		}); // Tìm và cập nhật thông tin tuyến xe buýt theo ID
		if (!route) {
			return res.status(404).json({ message: "Không tìm thấy xe buýt" });
		}
		res.status(200).json(route); // Trả về thông tin tuyến xe buýt đã được cập nhật dưới dạng JSON
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Phương thức để xóa một tuyến xe buýt
const deleteRoute = async (req, res) => {
	try {
		const route = await Route.findByIdAndDelete(req.params.id); // Tìm và xóa xe buýt theo ID
		if (!route) {
			return res.status(404).json({ message: "Không tìm thấy xe buýt" });
		}
		res.status(200).json({ message: "Xóa xe buýt thành công" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export {
	getAllStations,
	createStation,
	createListStation,
	updateRoute,
	deleteRoute,
};
