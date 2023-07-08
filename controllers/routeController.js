import Route from "../models/Route.js"; // Import Route model
import Schedule from "../models/Schedule.js";
import Station from "../models/Station.js"; // Import Station model

// Phương thức để lấy danh sách tất cả các tuyến xe buýt
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("forwardRoute backwardRoute"); // Lấy danh sách tất cả các tuyến xe buýt từ cơ sở dữ liệu
    res.status(200).json(routes); // Trả về danh sách các tuyến xe buýt dưới dạng JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
  }
};

// Phương thức lấy thông tin rcủa tất cả các tuyến xe
const getAllRoutesInfo = async (req, res) => {
  try {
    const routes = await Route.find().select("-forwardRoute -backwardRoute"); // Lấy danh sách tất cả các tuyến xe buýt từ cơ sở dữ liệu
    res.status(200).json(routes); // Trả về danh sách các tuyến xe buýt dưới dạng JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
  }
};

const getForwardRouteStations = async (req, res) => {
  const { routeNumber } = req.params;
  try {
    const route = await Route.findOne({
      routeNumber: routeNumber,
    }).populate("forwardRoute");
    const forwardStations = route.forwardRoute.map((station) => ({
      id: station._id,
      name: station.name,
      location: station.location,
      // Thêm các thông tin khác của station nếu cần thiết
    }));

    // Lấy thông tin lịch trình cho route
    const schedule = await Schedule.findOne({ route: route._id });

    const result = {
      route: {
        id: route._id,
        routeName: route.routeName,
        routeNumber: route.routeNumber,
        cost: route.cost,
        forwardRoute: forwardStations,
      },
      schedule: schedule
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBackwardRouteStations = async (req, res) => {
  const { routeNumber } = req.params;
  try {
    const route = await Route.findOne({
      routeNumber: routeNumber,
    }).populate("backwardRoute");
    const backwardStations = route.backwardRoute.map((station) => ({
      id: station._id,
      name: station.name,
      location: station.location,
      // Thêm các thông tin khác của station nếu cần thiết
    }));

    // Lấy thông tin lịch trình cho route
    const schedule = await Schedule.findOne({ route: route._id });
    const { departureTime, arrivalTime } = schedule;

    const result = {
      route: {
        id: route._id,
        routeName: route.routeName,
        routeNumber: route.routeNumber,
        cost: route.cost,
        backwardRoute: backwardStations,
      },
      schedule: {
        departureTime: departureTime.join(", "),
        arrivalTime: arrivalTime.join(", "),
      },
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Phương thức để tạo một tuyến xe buýt mới
const createRoute = async (req, res) => {
  try {
    const newRoute = new Route(req.body); // Tạo đối tượng Route mới từ dữ liệu gửi lên từ client
    await newRoute.save(); // Lưu đối tượng Route mới vào cơ sở dữ liệu
    res.status(201).json(newRoute); // Trả về đối tượng Route mới đã được tạo dưới dạng JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xử lý lỗi nếu có
  }
};

const addListStationToRoute = async (req, res) => {
  try {
    const routeNumber = req.body.routeNumber;
    const forwardStations = req.body.originalReturn;
    const backwardStations = req.body.destinationReturn;

    const route = await Route.findOne({
      routeNumber: routeNumber,
    });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    //Create or update stations
    const updatedForwardStations = await Promise.all(
      forwardStations.map(async (station) => {
        const existingStation = await Station.findOne({
          name: station.name,
        });

        if (existingStation) {
          return existingStation;
        }

        const newStation = new Station({
          name: station.address,
          location: {
            lng: station.latLng.lng,
            lat: station.latLng.lat,
          },
        });

        await newStation.save();
        return newStation;
      })
    );

    // Create or update stations
    const updatedBackwardStations = await Promise.all(
      backwardStations.map(async (station) => {
        const existingStation = await Station.findOne({
          name: station.address,
        });

        if (existingStation) {
          return existingStation;
        }

        const newStation = new Station({
          name: station.name,
          location: {
            lng: station.lng,
            lat: station.lat,
          },
        });

        await newStation.save();
        return newStation;
      })
    );

    // Update backward trip and forward trip
    route.backwardRoute = [...route.backwardRoute, ...updatedBackwardStations];
    route.forwardRoute = [...route.forwardRoute, ...updatedForwardStations];
    await route.save();

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
  createRoute,
  getAllRoutes,
  addListStationToRoute,
  updateRoute,
  deleteRoute,
  getAllRoutesInfo,
  getForwardRouteStations,
  getBackwardRouteStations,
};
