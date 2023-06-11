import express from "express";
const router = express.Router();

import {
  register,
  login,
  changePassword,
  getAllAccounts,
  deleteAccounts,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/").get(getAllAccounts);
router.route("/:id").delete(deleteAccounts);
router.route("/change-password").post(authenticateUser, changePassword);

export default router;
