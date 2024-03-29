import Bus from "../models/Bus.js";
import Location from "../models/Location.js";
import Route from "../models/Route.js";

// Lấy danh sách tất cả các xe buýt
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find(); // Lấy danh sách tất cả các bản ghi từ bảng Bus
    res.status(200).json(buses); // Trả về danh sách xe buýt dưới dạng JSON
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Lấy thông tin chi tiết của một xe buýt dựa trên ID
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id); // Tìm xe buýt theo ID
    if (!bus) {
      return res.status(404).json({ message: "Không tìm thấy xe buýt" });
    }
    res.status(200).json(bus); // Trả về thông tin xe buýt dưới dạng JSON
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Tạo mới một xe buýt
const createBusInformation = async (req, res) => {
  const route = await Route.findOne({ routeNumber: req.body.routeNumber });
  if (!route) {
    return res.status(400).json("Route not found");
  }

  const bus = new Bus({
    busNumber: req.body.busNumber, // Lấy biển số xe từ request body
    // brand: req.body.brand, // Lấy hãng xe từ request body
    routeId: route, // Lấy ID của tuyến xe từ request body
  });

  try {
    const newBus = await bus.save(); // Lưu xe buýt vào MongoDB
    res.status(201).json(newBus); // Trả về thông tin xe buýt mới được tạo dưới dạng JSON
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Cập nhật thông tin của một xe buýt dựa trên ID
const updateBusInformation = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // Tìm và cập nhật thông tin xe buýt theo ID
    if (!bus) {
      return res.status(404).json("Không tìm thấy xe buýt");
    }
    res.status(200).json(bus); // Trả về thông tin xe buýt đã được cập nhật dưới dạng JSON
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Xóa một xe buýt dựa trên ID
const deleteBusInformation = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id); // Tìm và xóa xe buýt theo ID
    if (!bus) {
      return res.status(404).json({ message: "Không tìm thấy xe buýt" });
    }
    res.status(200).json({ message: "Xóa xe buýt thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBusStatus = async (req, res) => {
  try {
    const bus = await Bus.findOne({ busNumber: req.body.busNumber });
    if (!bus) {
      return res.status(400).json({ message: "Bus not found" });
    }
    bus.activeStatus = !bus.activeStatus;
    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getActiveBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ activeStatus: true }).populate("routeId");
    if (!buses || buses.length === 0) {
      return res.status(200).json(0);
    }

    const busLocations = await Promise.all(
      buses.map(async (bus) => {
        const location = await Location.findOne({ busId: bus._id });
        return {
          bus: bus,
          routeNumber: bus.routeId.routeNumber,
          location,
        };
      })
    );

    res.status(200).json(busLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createBusInformation,
  deleteBusInformation,
  updateBusInformation,
  getAllBuses,
  getBusById,
  updateBusStatus,
  getActiveBuses,
};
