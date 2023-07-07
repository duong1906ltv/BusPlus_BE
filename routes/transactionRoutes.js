import express from "express";
const router = express.Router();

import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction } from "../controllers/transactionController .js";
import authenticateUser from "../middleware/auth.js";


router.route("/").get(getAllTransactions).post(authenticateUser, createTransaction);
router
  .route("/:id")
  .get(getTransactionById)
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default router;
