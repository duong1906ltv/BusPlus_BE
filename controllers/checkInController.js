import CheckIn from "../models/CheckIn.js";
import Profile from "../models/Profile.js";

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

const getFollowStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = req.params.id;

    const FriendProfile = await Profile.findOne({ user: friendId });

    console.log(FriendProfile);

    if (!FriendProfile) {
      return res.status(404).json({ message: "Friend profile not found" });
    }

    const friendStatus = FriendProfile.friends.find(
      (friend) => friend.user.toString() === userId.toString()
    );

    if (!friendStatus) {
      return res
        .status(404)
        .json({ message: "Friend not found in your friends list" });
    }

    res.json({ status: friendStatus.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getAllCheckIns, createCheckIn, getFollowStatus };