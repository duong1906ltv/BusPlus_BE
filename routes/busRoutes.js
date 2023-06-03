import express from "express";
const router = express.Router();

import {
	createBusInformation,
	deleteBusInformation,
	updateBusInformation,
	getAllBuses,
	getBusById,
	updateBusStatus,
	getActiveBus,
} from "../controllers/busController.js";

router.route("/").get(getAllBuses).post(createBusInformation);
router.route("/status").put(updateBusStatus);
router.route("/active").get(getActiveBus)
router
	.route("/:id")
	.get(getBusById)
	.put(updateBusInformation)
	.delete(deleteBusInformation);

export default router;
