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
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "Couldn't find ticket type" });
    }

    res.json({ message: "Deleted ticket type successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getAllUser,
  createUser,
  deleteUser,
};
