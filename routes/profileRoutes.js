import express from "express";
const router = express.Router();

import {
  getAllProfile,
  updateProfile,
  deleteFriend,
  getProfileById,
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  freezeUser,
  getListFriend,
  activeUser,
  getRequestById,
} from "../controllers/profileController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/:userId").patch(updateProfile);
router.route("/").get(getAllProfile).patch(authenticateUser, updateProfile);
router.route("/:userId").get(getProfileById);
router.route("/send-request").post(authenticateUser, sendFriendRequest);
router.route("/accept-request/:id").post(acceptRequest);
router.route("/get-request/:id").get(getRequestById);
router.route("/reject-request/:id").post(rejectRequest);
router.route("/freeze").post(authenticateUser, freezeUser);
router.route("/active").post(authenticateUser, activeUser);
router.route("/get-friends/:id").get(getListFriend);
router.route("/delete-friend/:friendId").delete(authenticateUser, deleteFriend);

export default router;
