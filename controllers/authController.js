import User from "../models/User.js";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email: email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
    return;
  }

  const user = await User.create({ username, email, password });
  const token = user.createJWT();
  res.status(200).json({
    user: user,
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(200).json({ user, token });
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await User.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccounts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;

    const dbUser = await User.findById(userId).select("+password");
    if (dbUser) {
      const currentPassword = req.body.currentPassword;
      const isPasswordCorrect = await dbUser.comparePassword(currentPassword);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: "Wrong password!",
        });
      }

      var salt = bcrypt.genSaltSync(10);
      const updateUser = {
        password: bcrypt.hashSync(req.body.newPassword, salt),
      };
      await User.findOneAndUpdate(
        { _id: req.user.userId },
        { $set: updateUser },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "Password change successfully!",
      });
    } else {
      return res.status(404).json({
        message: "User not found!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
};

export { register, login, changePassword, getAllAccounts, deleteAccounts };
