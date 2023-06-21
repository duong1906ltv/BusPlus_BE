import Profile from "../models/Profile.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

const getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not exist" });
    }
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật hồ sơ
const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phone, address, dateOfBirth, avatar, gender } =
      req.body;

    const userId = req.user.userId;

    // Kiểm tra xem hồ sơ có tồn tại hay không
    const existingProfile = await Profile.findOne({ user: userId });

    if (!existingProfile) {
      return res.status(404).json({ error: "Profile is not exist" });
    }

    // Cập nhật thông tin hồ sơ
    existingProfile.fullname = fullname;
    existingProfile.email = email;
    existingProfile.phone = phone;
    existingProfile.address = address;
    existingProfile.dateOfBirth = dateOfBirth;
    existingProfile.avatar = avatar;
    existingProfile.gender = gender;

    // Lưu hồ sơ đã cập nhật
    const updatedProfile = await existingProfile.save();

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({
      error: "Đã xảy ra lỗi khi cập nhật profile",
    });
  }
};

const getAllProfile = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const addFriend = async (req, res) => {
//   const { email, phone } = req.body;

//   try {
//     let user = null;

//     // Kiểm tra nếu số điện thoại được cung cấp
//     if (phone) {
//       user = await User.findOne({ phone });
//     }
//     // Kiểm tra nếu email được cung cấp và không tìm thấy user qua số điện thoại
//     if (email && !user) {
//       user = await User.findOne({ email });
//     }

//     // Kiểm tra nếu không tìm thấy user
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Thêm user vào danh sách bạn bè
//     const myprofile = await Profile.findOne({ user: req.user.userId });
//     myprofile.friends.push(user._id);
//     await myprofile.save();

//     const friendProfile = await Profile.findOne({ phone: phone });
//     friendProfile.friends.push(req.user.userId);
//     await friendProfile.save();

//     res.json({ message: "Friend added successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error." });
//   }
// };

const deleteFriend = async (req, res) => {
  const { friendId } = req.params;

  try {
    // Kiểm tra xem người dùng hiện tại đã có trong cơ sở dữ liệu chưa
    const currentUserProfile = await Profile.findOne({ user: req.user.userId });
    const friendProfile = await Profile.findOne({ user: friendId });

    if (!currentUserProfile) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy thông tin người dùng." });
    }

    if (!friendProfile) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy thông tin người dùng." });
    }

    // Kiểm tra xem người bạn đã tồn tại trong danh sách bạn bè hay chưa
    const isFriend = currentUserProfile.friends.some(
      (friend) => friend.user.toString() === friendId
    );
    if (!isFriend) {
      return res
        .status(400)
        .json({ error: "Người bạn không tồn tại trong danh sách bạn bè." });
    }

    // Xóa friendId khỏi danh sách bạn bè của người dùng hiện tại
    currentUserProfile.friends = currentUserProfile.friends.filter(
      (friend) => friend.user.toString() !== friendId
    );

    friendProfile.friends = friendProfile.friends.filter(
      (friend) => friend.user.toString() !== req.user.userId
    );

    await currentUserProfile.save();
    await friendProfile.save();

    res.status(200).json({ message: "Xóa bạn bè thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi server." });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const phone = req.body.phone;
    const recipientId = await User.findOne({ phone: phone });

    const senderId = req.user.userId;

    // Kiểm tra xem yêu cầu đã tồn tại hay chưa
    const existingRequest = await FriendRequest.findOne({
      senderId: senderId,
      recipientId: recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    const receivedRequest = await FriendRequest.findOne({
      senderId: recipientId,
      recipientId: senderId,
    });

    if (receivedRequest) {
      return res.status(400).json({
        error: "You have been received friend request from this user",
      });
    }

    // Kiểm tra xem đã là bạn bè hay chưa
    const areFriends = await Profile.exists({
      user: senderId,
      friends: { $elemMatch: { user: recipientId } },
    });

    if (areFriends) {
      return res.status(400).json({ error: "Already friends" });
    }

    // Kiểm tra xem người gửi và người nhận tồn tại hay không
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(400).json({ error: "Invalid user" });
    }

    // Tạo yêu cầu kết bạn mới
    const newRequest = new FriendRequest({
      senderId,
      recipientId,
    });
    await newRequest.save();

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(400).json({ error: "Request not found" });
    }

    // Thêm user vào danh sách bạn bè
    const senderProfile = await Profile.findOne({ user: request.senderId });

    const recipientProfile = await Profile.findOne({
      user: request.recipientId,
    });

    senderProfile.friends.push({
      user: request.recipientId,
      profile: recipientProfile,
    });
    await senderProfile.save();

    recipientProfile.friends.push({
      user: request.senderId,
      profile: senderProfile,
    });
    await recipientProfile.save();

    await FriendRequest.findByIdAndRemove(requestId);
    const updatedRequest = await FriendRequest.find()
      .populate({
        path: "senderId",
        populate: {
          path: "profile",
          model: "Profile",
        },
      })
      .exec();
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const getRequestById = async (req, res) => {
  try {
    const userId = req.params.id;
    const request = await FriendRequest.find({ recipientId: userId })
      .populate({
        path: "senderId",
        populate: {
          path: "profile",
          model: "Profile",
        },
      })
      .exec();

    // Lấy thông tin avatar của senderId
    const populatedRequest = request.map((req) => ({
      ...req.toObject(),
      senderAvatar: req.senderId.profile.avatar,
    }));

    res.status(200).json(populatedRequest);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(400).json({ error: "Request not found" });
    }
    await FriendRequest.findByIdAndRemove(requestId);
    const updatedRequest = await FriendRequest.find()
      .populate({
        path: "senderId",
        populate: {
          path: "profile",
          model: "Profile",
        },
      })
      .exec();
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const freezeUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = req.body.userId;

    // Kiểm tra xem người dùng tồn tại hay không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }

    // Tìm và cập nhật trạng thái của bạn bè thành "freeze"
    const profile = await Profile.findOneAndUpdate(
      { user: userId, friends: { $elemMatch: { user: friendId } } },
      { $set: { "friends.$.status": "freeze" } },
      { new: true }
    );

    if (!profile) {
      return res.status(400).json({ error: "Friend not found" });
    }

    return res.status(200).json({ message: "Status updated to freeze" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const activeUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = req.body.userId;

    // Kiểm tra xem người dùng tồn tại hay không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }

    // Tìm và cập nhật trạng thái của bạn bè thành "freeze"
    const profile = await Profile.findOneAndUpdate(
      { user: userId, friends: { $elemMatch: { user: friendId } } },
      { $set: { "friends.$.status": "active" } },
      { new: true }
    );

    if (!profile) {
      return res.status(400).json({ error: "Friend not found" });
    }

    return res.status(200).json({ message: "Status updated to active" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getListFriend = async (req, res) => {
  try {
    const userId = req.params.id;
    // Lấy thông tin hồ sơ của người dùng và populate danh sách bạn bè,
    // sau đó populate thông tin avatar cho từng bạn bè
    const profile = await Profile.findOne({ user: userId }).populate({
      path: "friends.profile",
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const friends = profile.friends.map((friend) => ({
      status: friend.status,
      profile: friend.profile,
    }));

    return res.status(200).json(friends);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export {
  updateProfile,
  getAllProfile,
  deleteFriend,
  getProfileById,
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  freezeUser,
  getListFriend,
  activeUser,
  getRequestById,
};
