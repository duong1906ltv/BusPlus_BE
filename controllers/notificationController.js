import Notification from "../models/Notification.js";

const getAllNotifications = async (req, res) => {
  try {
    const notis = await Notification.find();
    res.status(200).json(notis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    const notis = await Notification.find({ type: "admin noti" }).sort({
      createdAt: -1,
    });
    res.status(200).json(notis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotificationsOfUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.id })
      .populate({
        path: "friend",
        populate: {
          path: "profile",
          model: "Profile",
        },
      })
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

const getCurrentAdminNotification = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const notifications = await Notification.find(
      {
        type: 'admin noti',
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })


    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createNotification = async (req, res) => {
  var {
    user,
    type,
    title,
    description,
    expiredAt,
    friend,
    lat,
    lng,
    busNumber,
    routeNumber,
    status,
  } = req.body;
  if (!expiredAt) {
    var currentDate = new Date();
    expiredAt = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  try {
    // Nếu chưa tồn tại, tạo bản ghi mới
    const notification = new Notification({
      user,
      type,
      title,
      description,
      expiredAt,
      friend,
      lat,
      lng,
      busNumber,
      routeNumber,
      status,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNotification = async (req, res) => {
  const { title, description, expiredAt } = req.body;
  const id = req.params.id;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { title, description, expiredAt } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Couldn't find notification" });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  const id = req.params.id;

  try {
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: "Couldn't find notification" });
    }

    res.json({ message: "Deleted notification successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllNotifications,
  getAdminNotifications,
  getAllNotificationsOfUser,
  getCurrentAdminNotification,
  createNotification,
  updateNotification,
  deleteNotification,
};
