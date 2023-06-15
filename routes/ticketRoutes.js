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
  getAllTicketsOfUser,
} from "../controllers/ticketController.js";

router.route("/").get(getAllTickets).post(createTicket);
router.route("/my-ticket/:id").get(getAllTicketsOfUser);
router
  .route("/:id")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(deleteTicket);
router.route("/qrcode/:id").get(generateUserTicketQRCode);

export default router;
