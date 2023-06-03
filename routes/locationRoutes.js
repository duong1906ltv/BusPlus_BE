import express from "express";
const router = express.Router();

import {
	getAllLocations,
	getLocationById,
	getLocationsByBusId,
	createLocation,
	updateLocationById,
	deleteLocationById,
	updateLocationOfBus,
	simulateBusLocation,
} from "../controllers/locationController.js";

router.route("/").get(getAllLocations).post(createLocation);
router
	.route("/:id")
	.get(getLocationById)
	.put(updateLocationById)
	.delete(deleteLocationById);
router.route("/bus/location").put(updateLocationOfBus);
router.route("/Busid/:busId").get(getLocationsByBusId);
router.route("/fake").post(simulateBusLocation)

export default router;
