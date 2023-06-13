import express from "express";
const router = express.Router();

import {
  getAllProfile,
  updateProfile,
  addFriend,
  deleteFriend,
  getProfileById,
} from "../controllers/profileController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/").get(getAllProfile).patch(authenticateUser, updateProfile);
router.route("/:userId").get(getProfileById);
router.route("/add-friend").post(authenticateUser, addFriend);
router.route("/delete-friend/:friendId").delete(authenticateUser, deleteFriend);

export default router;
