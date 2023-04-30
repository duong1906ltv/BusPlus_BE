import express from "express";
const router = express.Router();

import {
	createRoute,
	deleteRoute,
	getAllRoutes,
	updateRoute,
	addListStationToRoute,
	getAllRoutesInfo,
} from "../controllers/routeController.js";

router.route("/").get(getAllRoutes).post(createRoute);
router.route("/routeinfo").get(getAllRoutesInfo);
router.route("/addstations").post(addListStationToRoute);
router.route("/:id").put(updateRoute).delete(deleteRoute);

export default router;
