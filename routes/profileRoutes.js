import express from "express";
const router = express.Router();

import {
  getAllProfile,
  updateProfile,
  addFriend,
  deleteFriend,
} from "../controllers/profileController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/").get(getAllProfile);
router.route("/add-friend").post(authenticateUser, addFriend);
router.route("/delete-friend/:friendId").delete(authenticateUser, deleteFriend);
router.route("/:userId").patch(authenticateUser, updateProfile);

export default router;
