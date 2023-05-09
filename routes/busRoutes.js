import express from "express";
const router = express.Router();

import {
	createBusInformation,
	deleteBusInformation,
	updateBusInformation,
	getAllBuses,
	getBusById,
} from "../controllers/busController.js";

router.route("/").get(getAllBuses).post(createBusInformation);
router
	.route("/:id")
	.get(getBusById)
	.put(updateBusInformation)
	.delete(deleteBusInformation);

export default router;
