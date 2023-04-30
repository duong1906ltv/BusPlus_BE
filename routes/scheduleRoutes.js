import express from "express";
const router = express.Router();

import {
	getAllSchedules,
	createSchedule,
	deleteSchedule,
} from "../controllers/scheduleController.js";

router.route("/").get(getAllSchedules).post(createSchedule);
router.route("/:id").delete(deleteSchedule);

export default router;
