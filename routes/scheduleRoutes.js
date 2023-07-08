import express from "express";
const router = express.Router();

import {
	getAllSchedules,
	createSchedule,
	deleteSchedule,
	updateSchedule,
} from "../controllers/scheduleController.js";

router.route("/").get(getAllSchedules).post(createSchedule);
router.route("/:routeNumber").patch(updateSchedule);
router.route("/:id").delete(deleteSchedule);

export default router;
