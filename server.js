import express from "express";

const app = express();
app.use(express.json());

app.use(express.static("public"));

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect.js";

import cors from "cors";
app.use(cors());

import {
  busChangeStream,
  locationChangeStream,
  checkInStream,
  checkInLocationStream,
} from "./socket/index.js";
import { Server } from "socket.io";
import http from "http";
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  busChangeStream(socket);
  locationChangeStream(socket);
  checkInStream(socket);
  checkInLocationStream(socket);

  // Ngắt kết nối của client
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

//routers
import routeRoutes from "./routes/routeRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import notiRoutes from "./routes/notiRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/noti", notiRoutes);

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
