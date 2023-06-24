import express from "express";
const router = express.Router();

import {
  createNotification,
  getAllNotifications,
  getAllNotificationsOfUser,
} from "../controllers/notificationController.js";

router.route("/").get(getAllNotifications).post(createNotification);
router.route("/:id").get(getAllNotificationsOfUser);

export default router;
