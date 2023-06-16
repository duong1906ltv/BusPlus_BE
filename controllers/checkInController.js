import CheckIn from "../models/CheckIn.js";

// Lấy danh sách tất cả các vé
const getAllCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find();
    res.status(200).json(checkIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo một vé mới
const createCheckIn = async (req, res) => {
  const { status, user } = req.body;

  const checkIn = new CheckIn({
    status,
    user,
  });

  try {
    const newCheckIn = await checkIn.save();
    res.status(201).json(newCheckIn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllCheckIns, createCheckIn };
