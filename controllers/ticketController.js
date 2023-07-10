import Ticket from "../models/Ticket.js";
import QRCode from "qrcode";
import User from "../models/User.js";

// Lấy danh sách tất cả các vé
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo một vé mới
const createTicket = async (req, res) => {
  const { ticketType, month, year, description } = req.body;
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User is not found" });
  }

  const lastTicket = await Ticket.findOne().sort({ $natural: -1 });

  const ticketNumber = lastTicket ? Number(lastTicket.ticketCode) + 1 : 1;
  const ticketCode = ticketNumber.toString().padStart(8, "0");

  const ticket = new Ticket({
    user,
    ticketType,
    month,
    year,
    ticketCode,
    description,
  });

  try {
    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

// Lấy thông tin một vé cụ thể
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id); // Tìm vé theo ID
    if (!ticket) {
      return res.status(404).json({ message: "Không tìm thấy vé" });
    }
    res.status(200).json(ticket); // Trả về thông tin vé dưới dạng JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách tất cả các vé
const getAllTicketsOfUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const tickets = await Ticket.find({ user: userId })
      .populate({
        path: "user",
        populate: {
          path: "profile",
          model: "Profile",
        },
      })
      .populate("ticketType")
      .sort({ month: 1 })
      .exec();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin một vé
const updateTicket = async (req, res) => {
  const { ticketType, month, year, description } = req.body;
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { ticketType, month, year, description } },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa một vé
const deleteTicket = async (req, res) => {
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findByIdAndDelete(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Deleted ticket" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sinh QR code cho vé của người dùng đang đăng nhập
const generateUserTicketQRCode = async (req, res) => {
  const user = req.params.id; // Lấy ID của người dùng từ session hoặc token

  try {
    // Tìm vé của người dùng trong cơ sở dữ liệu
    const tickets = await Ticket.find({ user: user })
      .sort({ $natural: -1 })
      .exec();
    if (tickets.length === 0) {
      return res.status(200).json(tickets);
    }
    // Lặp qua từng vé và sinh QR code
    const qrCodes = await Promise.all(
      tickets.map(async (ticket) => {
        // Tạo dữ liệu cho mã QR code từ thông tin vé
        const qrCodeData = {
          ticketCode: ticket.ticketCode,
          user: ticket.user,
          ticketType: ticket.ticketType,
          month: ticket.month,
          year: ticket.year,
          description: ticket.description,
        };
        // Chuyển đổi dữ liệu thành chuỗi JSON
        const jsonData = JSON.stringify(qrCodeData);
        // Sinh QR code từ dữ liệu
        const qrCode = await QRCode.toDataURL(jsonData);
        return qrCode;
      })
    );
    return res.json(qrCodes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};

export {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  generateUserTicketQRCode,
  getAllTicketsOfUser,
};
