import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("user").sort({ createdAt: -1 });;
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTransaction = async (req, res) => {
  const { description, amount } = req.body;
  const userId = req.user.userId;
  const user = await User.findById(userId)
  const transaction = new Transaction({
    user,
    description,
    amount,
  });
  try {
    const newTransaction = await transaction.save();
    console.log(newTransaction);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction is not found" });
    }
    res.status(200).json(transaction); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateTransaction = async (req, res) => {
  const { description, amount } = req.body;
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { $set: { description, amount} },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction is not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa một giao dịch
const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction is not found" });
    }

    res.json({ message: "Deleted transaction" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
};
