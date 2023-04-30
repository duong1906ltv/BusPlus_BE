import express from "express";
const router = express.Router();

import {
	createListStation,
	getAllStations,
} from "../controllers/stationController.js";

router.route("/").get(getAllStations);
router.route("/list").post(createListStation);

export default router;
