import express from "express";
const router = express.Router();

import authenticateUser from "../middleware/auth.js";

import {
  getAllCheckIns,
  createCheckIn,
  getFollowStatus,
} from "../controllers/checkInController.js";

router.route("/").get(getAllCheckIns).post(createCheckIn);
router.route("/follow-status/:id").get(authenticateUser, getFollowStatus);

export default router;
