import express from "express";
const router = express.Router();

import {
	createListStation,
	createStation,
	deleteStation,
	getAllStations,
	updateStation,
} from "../controllers/stationController.js";

router.route("/").get(getAllStations);
router.route("/list").post(createListStation);
router.route("/").post(createStation);
router.route("/:id").patch(updateStation);
router.route("/:id").post(deleteStation);

export default router;
