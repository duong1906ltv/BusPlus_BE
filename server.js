import express from "express";

const app = express();
app.use(express.json());

app.use(express.static("public"));

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect.js";

import cors from "cors";
app.use(cors());

//routers
import routeRoutes from "./routes/routeRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import scheduleRoute from "./routes/scheduleRoutes.js";

app.use("/api/routes", routeRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/schedules", scheduleRoute);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}...`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
