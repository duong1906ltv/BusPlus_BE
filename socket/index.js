import Location from "../models/Location.js";
import Bus from "../models/Bus.js";
import CheckIn from "../models/CheckIn.js";
import CheckInLocation from "../models/CheckInLocation.js";

export const locationChangeStream = (socket) => {
  // Lắng nghe sự kiện cập nhật từ bảng "Location"
  const locationChangeStream = Location.watch();

  // Khi có sự thay đổi trong bảng "Location"
  locationChangeStream.on("change", async (change) => {
    if (change.operationType === "update") {
      const documentId = change.documentKey._id;
      // Truy vấn MongoDB để lấy document mới nhất
      const updatedDocument = await Location.findById(documentId);
      // Cập nhật vị trí của biểu tượng xe buýt trên bản đồ
      socket.emit("locationChange", updatedDocument);
    }
  });
};

export const busChangeStream = (socket) => {
  // Lắng nghe sự kiện cập nhật từ bảng "Bus"
  const busChangeStream = Bus.watch();

  // Khi có sự thay đổi trong bảng "Bus"
  busChangeStream.on("change", async (change) => {
    if (change.operationType === "update") {
      const documentId = change.documentKey._id;
      const updatedBus = await Bus.findById(documentId);
      const currentLocation = await Location.findOne({ busId: documentId });

      // Kiểm tra trạng thái của Bus
      if (updatedBus.activeStatus === true) {
        // Gửi thông báo tới client để tạo biểu tượng xe buýt trên bản đồ
        socket.emit("busChange", { updatedBus, currentLocation });
      } else {
        socket.emit("busChange", { updatedBus });
      }
    }
  });
};

export const checkInStream = (socket) => {
  const checkInStream = CheckIn.watch();

  // Khi có sự thay đổi trong bảng "Bus"
  checkInStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const lastCheckin = await CheckIn.findOne().sort({ $natural: -1 });
      if (lastCheckin.status === "CheckIn") {
        socket.emit("CheckIn", lastCheckin);
      }
      if (lastCheckin.status === "CheckOut") {
        socket.emit("CheckOut", lastCheckin);
      }
    }
  });
};

export const checkInLocationStream = (socket) => {
  const checkInLocationStream = CheckInLocation.watch();
  checkInLocationStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const lastCheckin = await CheckInLocation.findOne()
        .sort({ $natural: -1 })
        .populate("checkinId");

      socket.emit("startHearingLocationOfUser", lastCheckin);
    }
    if (change.operationType === "update") {
      const documentId = change.documentKey._id;
      // Truy vấn MongoDB để lấy document mới nhất
      const updatedDocument = await CheckInLocation.findById(
        documentId
      ).populate("checkinId");
      // Cập nhật vị trí của biểu tượng xe buýt trên bản đồ
      socket.emit("updateLocationOfUser", updatedDocument);
    }
  });
};
