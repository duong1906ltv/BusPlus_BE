import express from "express";
const router = express.Router();

import {
	createRoute,
	deleteRoute,
	getAllRoutes,
	updateRoute,
	addListStationToRoute,
	getAllRoutesInfo,
	getForwardRouteStations,
	getBackwardRouteStations,
	updateLocationOfBus,
} from "../controllers/routeController.js";

router.route("/").get(getAllRoutes).post(createRoute);
router.route("/routeinfo").get(getAllRoutesInfo);
router.route("/addstations").post(addListStationToRoute);
router.route("/forward-route/:routeNumber").get(getForwardRouteStations);
router.route("/backward-route/:routeNumber").get(getBackwardRouteStations);
router.route("/:id").put(updateRoute).delete(deleteRoute);
router.route("/bus/location").put(updateLocationOfBus);

export default router;
