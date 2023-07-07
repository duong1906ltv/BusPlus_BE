import express from "express";
const router = express.Router();

import {
  createNotification,
  deleteNotification,
  getAdminNotifications,
  getAllNotifications,
  getAllNotificationsOfUser,
  updateNotification,
} from "../controllers/notificationController.js";

router.route("/admin").get(getAdminNotifications)
router.route("/:id").patch(updateNotification)
router.route("/:id").delete(deleteNotification)
router.route("/").get(getAllNotifications).post(createNotification);
router.route("/:id").get(getAllNotificationsOfUser);

export default router;
