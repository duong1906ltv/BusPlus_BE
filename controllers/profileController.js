import Profile from "../models/Profile.js";
import User from "../models/User.js";

// Cập nhật hồ sơ
const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, address, dateOfBirth, avatar, gender } =
      req.body;
    const userId = req.params.userId;

    // Kiểm tra xem hồ sơ có tồn tại hay không
    const existingProfile = await Profile.findOne({ user: userId });

    if (!existingProfile) {
      return res.status(404).json({ message: "Hồ sơ không tồn tại" });
    }

    // Cập nhật thông tin hồ sơ
    existingProfile.fullName = fullName;
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
      message: "Đã xảy ra lỗi khi cập nhật hồ sơ",
      error: error.message,
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

const addFriend = async (req, res) => {
  const { email, phone } = req.body;

  try {
    let user = null;

    // Kiểm tra nếu số điện thoại được cung cấp
    if (phone) {
      user = await User.findOne({ phone });
    }
    // Kiểm tra nếu email được cung cấp và không tìm thấy user qua số điện thoại
    if (email && !user) {
      user = await User.findOne({ email });
    }

    // Kiểm tra nếu không tìm thấy user
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Thêm user vào danh sách bạn bè
    const myprofile = await Profile.findOne({ user: req.user.userId });
    myprofile.friends.push(user._id);
    await myprofile.save();

    const friendProfile = await Profile.findOne({ phone: phone });
    friendProfile.friends.push(req.user.userId);
    await friendProfile.save();

    res.json({ message: "Friend added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const deleteFriend = async (req, res) => {
  const { friendId } = req.params;

  try {
    // Kiểm tra xem người dùng hiện tại đã có trong cơ sở dữ liệu chưa
    const currentUserProfile = await Profile.findOne({ user: req.user.userId });
    if (!currentUserProfile) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin người dùng." });
    }

    // Kiểm tra xem người bạn đã tồn tại trong danh sách bạn bè hay chưa
    const isFriend = currentUserProfile.friends.includes(friendId);
    if (!isFriend) {
      return res
        .status(400)
        .json({ message: "Người bạn không tồn tại trong danh sách bạn bè." });
    }

    // Xóa friendId khỏi danh sách bạn bè của người dùng hiện tại
    currentUserProfile.friends = currentUserProfile.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    await currentUserProfile.save();

    res.status(200).json({ message: "Xóa bạn bè thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi server." });
  }
};

export { updateProfile, getAllProfile, addFriend, deleteFriend };
