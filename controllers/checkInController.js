import CheckIn from "../models/CheckIn.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

// Lấy danh sách tất cả các vé
const getAllCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find()
      .populate("user")
      .sort({ createdAt: -1 });
    res.status(200).json(checkIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentCheckIns = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const checkIns = await CheckIn.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).sort({ createdAt: -1 });

    const currentCheckIns = []
    checkIns.map(checkIn => {
      if (checkIn.status === "CheckIn") {
          const isExist = currentCheckIns.filter(item => item.user.toString() === checkIn.user.toString()).length
          const isCheckOut = checkIns.filter(item => item.status === "CheckOut" && item.user.toString() === checkIn.user.toString() && item.createdAt > checkIn.createdAt).length
        console.log(isExist, isCheckOut);

          if (!isExist && !isCheckOut) {
            currentCheckIns.push(checkIn)
          }
      }
    })

    res.status(200).json(currentCheckIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo một vé mới
const createCheckIn = async (req, res) => {
  const { status, userId, lat, lng, busNumber, routeNumber, createdAt } = req.body;

  const user = await User.findById(userId);
  const checkIn = new CheckIn({
    status,
    user,
    lat,
    lng,
    busNumber,
    routeNumber, createdAt
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

const getFriendsCheckInStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const userProfile = await Profile.findOne({ user: userId }).populate(
      "friends.user"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "User profile is not found" });
    }

    const friendCheckInStatus = [];

    for (const friend of userProfile.friends) {
      const friendProfile = await Profile.findOne({ user: friend.user });

      if (friendProfile.status !== "freeze") {
        const friendCheckIn = await CheckIn.findOne({
          user: friend.user,
        }).sort({ createdAt: -1 });

        if (friendCheckIn) {
          friendCheckInStatus.push({
            friend: friend.user,
            status: friendCheckIn.status,
            lat: friendCheckIn.lat,
            lng: friendCheckIn.lng,
          });
        }
      }
    }

    res.status(200).json({ friendCheckInStatus });
  } catch (error) {
    console.error("Error getting friends check-in status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const changeNotiStatus = async (req, res) => {
  try {
    const { checkinId } = req.body;

    const checkIn = await CheckIn.findByIdAndUpdate(checkinId, {
      $set: { noti: true },
    });

    res.status(200).json(checkIn);
  } catch (error) {
    console.error("Error getting friends check-in status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  getAllCheckIns,
  getCurrentCheckIns,
  createCheckIn,
  getFollowStatus,
  getFriendsCheckInStatus,
  changeNotiStatus,
};
