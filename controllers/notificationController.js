import Notification from "../models/Notification.js";

const getAllNotifications = async (req, res) => {
  try {
    const notis = await Notification.find();
    res.status(200).json(notis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotificationsOfUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.id })
      .populate("friend")
      .sort({ createdAt: -1 });

    const adminNotifications = await Notification.find({ user: null }).sort({
      createdAt: -1,
    });

    const allNotifications = [...notifications, ...adminNotifications];
    res.status(200).json(allNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNotification = async (req, res) => {
  const { user, type, description, friend, lat, lng } = req.body;

  try {
    // Nếu chưa tồn tại, tạo bản ghi mới
    const notification = new Notification({
      user,
      type,
      description,
      friend,
      lat,
      lng,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllNotifications, getAllNotificationsOfUser, createNotification };
