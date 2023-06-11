import express from "express";
const router = express.Router();

import authenticateUser from "../middleware/auth.js";

import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  generateUserTicketQRCode,
} from "../controllers/ticketController.js";

router.route("/").get(getAllTickets).post(createTicket);
router
  .route("/:id")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(deleteTicket);
router.route("/qrcode").post(authenticateUser, generateUserTicketQRCode);

export default router;
