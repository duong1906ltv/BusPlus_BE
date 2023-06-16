import express from "express";
const router = express.Router();

import {
  getAllCheckIns,
  createCheckIn,
} from "../controllers/checkInController.js";

router.route("/").get(getAllCheckIns).post(createCheckIn);

export default router;
