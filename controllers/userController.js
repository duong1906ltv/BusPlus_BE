import Profile from "../models/Profile.js";
import User, { ADMIN } from "../models/User.js";

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createUser = async (req, res) => {
  const { email, password } = req.body;
  const _user = await User.findOne({ email: email });
  if (_user) {
    return res.status(404).json({ error: "Email is already exist" });
  }
  const user = new User({
    email,
    password,
    role: ADMIN,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.params.id;

  
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Couldn't find profile" });
    }
    profile.deletedAt = new Date()
    const _profile = await profile.save();
    const deletedAt = new Date()
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { deletedAt } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Couldn't find user" });
    }

    res.json({ message: "Deleted user successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getAllUser,
  createUser,
  deleteUser,
};
