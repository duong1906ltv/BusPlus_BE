import express from "express";
const router = express.Router();

import authenticateUser from "../middleware/auth.js";
import { createTicketType, deleteTicketType, getAllTicketType, getTicketTypeById, updateTicketType } from "../controllers/ticketTypeController.js";



router.route("/").get(getAllTicketType);
router.route("/:id").get(getTicketTypeById);
router.route("/").post(createTicketType);
router.route("/:id").patch(updateTicketType);
router.route("/:id").delete(deleteTicketType);

export default router;
