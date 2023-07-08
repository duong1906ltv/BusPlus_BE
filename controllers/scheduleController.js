import Schedule from "../models/Schedule.js";
import Route from "../models/Route.js";

// Phương thức để lấy danh sách tất cả các lịch trình xe buýt
const getAllSchedules = async (req, res) => {
	try {
		const schedules = await Schedule.find(); // Lấy danh sách tất cả các tuyến xe buýt từ cơ sở dữ liệu
		res.status(200).json(schedules); // Trả về danh sách các tuyến xe buýt dưới dạng JSON
	} catch (error) {
		res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
	}
};

// Phương thức để tạo một tuyến xe buýt mới
const createSchedule = async (req, res) => {
	try {
		const { routeNumber, departureTime, arrivalTime } = req.body;

		// Tìm route theo routeId
		const route = await Route.findOne({
			routeNumber: routeNumber,
		});

		// Nếu không tìm thấy route thì trả về lỗi
		if (!route) {
			return res.status(404).json({ error: "Route not found" });
		}

		// Tạo một schedule mới
		const schedule = new Schedule({
			route: route._id,
			departureTime: departureTime,
			arrivalTime: arrivalTime,
		});

		// Lưu schedule mới vào database
		await schedule.save();

		// Trả về thông tin schedule đã tạo thành công
		res.status(201).json(schedule);
	} catch (error) {
		res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
	}
};

// Phương thức để cập nhật thông tin của một tuyến xe buýt
const updateSchedule = async (req, res) => {
	const routeNumber = req.params.routeNumber
	console.log("-------------");
	console.log(routeNumber);
	try {
		const route = await Route.findOne({
			routeNumber: routeNumber,
		});
		if (!route) {
			return res.status(404).json({ error: "Route is not found" });
		}
		const schedule = await Schedule.findOne({
			route: route,
		});
		if (!schedule) {
			return res.status(404).json({ error: "Schedule is not found" });
		}
		if (req.body.departureTime){
			schedule.departureTime = req.body.departureTime
		}
		if (req.body.arrivalTime) {
			schedule.departureTime = req.body.arrivalTime
		}
		await schedule.save()

		res.status(200).json(schedule); // Trả về thông tin tuyến xe buýt đã được cập nhật dưới dạng JSON
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Phương thức để xóa một tuyến xe buýt
const deleteSchedule = async (req, res) => {
	try {
		const schedule = await Schedule.findByIdAndDelete(req.params.id); // Tìm và xóa xe buýt theo ID
		if (!schedule) {
			return res
				.status(404)
				.json({ message: "Không tìm thấy lịch trình" });
		}
		res.status(200).json({ message: "Xóa lịch trình thành công" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export { createSchedule, getAllSchedules, updateSchedule, deleteSchedule };
