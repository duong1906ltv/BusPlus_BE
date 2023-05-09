import express from "express";

const app = express();
app.use(express.json());

app.use(express.static("public"));

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect.js";

import cors from "cors";
app.use(cors());

import { locationChangeStream } from "./socket/index.js";
import { Server } from "socket.io";
import http from "http";
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
	console.log(`Client connected: ${socket.id}`);
	// locationChangeStream(socket);
});

//routers
import routeRoutes from "./routes/routeRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import scheduleRoute from "./routes/scheduleRoutes.js";
import busRoute from "./routes/busRoutes.js";
import locationRoute from "./routes/locationRoutes.js";

app.use("/api/routes", routeRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/schedules", scheduleRoute);
app.use("/api/buses", busRoute);
app.use("/api/locations", locationRoute);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		server.listen(port, () => {
			console.log(`Server is listening on port ${port}...`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
