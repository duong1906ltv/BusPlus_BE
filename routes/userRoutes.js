import express from "express";
const router = express.Router();

import { createUser, deleteUser, getAllUser } from "../controllers/userController.js";



router.route("/").get(getAllUser);
router.route("/").post(createUser);
router.route("/:id").delete(deleteUser);

export default router;
