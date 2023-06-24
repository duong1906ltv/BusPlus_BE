import CheckInLocation from "../models/CheckInLocation.js";

// Lấy danh sách tất cả các vé
const getAllCheckInLocations = async (req, res) => {
  try {
    const checkIns = await CheckInLocation.find().populate("checkinId");
    res.status(200).json(checkIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCheckInLocation = async (req, res) => {
  const { checkinId, lat, lng } = req.body;

  try {
    // Kiểm tra xem đã tồn tại bản ghi check-in location dựa trên checkinId
    let checkInLocation = await CheckInLocation.findOne({ checkinId });

    if (checkInLocation) {
      // Nếu đã tồn tại, cập nhật vị trí mới
      checkInLocation.lat = lat;
      checkInLocation.lng = lng;
    } else {
      // Nếu chưa tồn tại, tạo bản ghi mới
      checkInLocation = new CheckInLocation({
        checkinId,
        lat,
        lng,
      });
    }

    const updatedCheckInLocation = await checkInLocation.save();
    res.status(201).json(updatedCheckInLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllCheckInLocations, createCheckInLocation };
