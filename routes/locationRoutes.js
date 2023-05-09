import express from "express";
const router = express.Router();

import {
	getAllLocations,
	getLocationById,
	getLocationsByBusId,
	createLocation,
	updateLocationById,
	deleteLocationById,
} from "../controllers/locationController.js";

router.route("/").get(getAllLocations).post(createLocation);
router
	.route("/:id")
	.get(getLocationById)
	.put(updateLocationById)
	.delete(deleteLocationById);
router.route("/Busid/:busId").get(getLocationsByBusId);

export default router;
