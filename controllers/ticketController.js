import Ticket from "../models/Ticket.js";
import QRCode from "qrcode";

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
  const { user, priority, ticketType, month, year } = req.body;

  // Lấy số lượng vé đã tạo từ cơ sở dữ liệu
  const count = await Ticket.countDocuments();

  // Tạo mã vé theo dạng số vé và số thứ tự
  const ticketCode = generateTicketCode(count);

  const ticket = new Ticket({
    user,
    priority,
    ticketType,
    month,
    year,
    ticketCode,
  });

  try {
    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hàm tạo mã vé theo số vé và số thứ tự
const generateTicketCode = (count) => {
  const ticketNumber = count + 1;
  const paddedNumber = ticketNumber.toString().padStart(8, "0");
  return paddedNumber;
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
      .exec();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin một vé
const updateTicket = async (req, res) => {
  const { priority, ticketType, month, year } = req.body;
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { priority, ticketType, month, year } },
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
  const user = req.user.userId; // Lấy ID của người dùng từ session hoặc token

  try {
    // Tìm vé của người dùng trong cơ sở dữ liệu
    const tickets = await Ticket.find({ user: user });
    if (tickets.length === 0) {
      return res.status(404).json({ message: "Không có vé cho người dùng" });
    }
    // Lặp qua từng vé và sinh QR code
    const qrCodes = await Promise.all(
      tickets.map(async (ticket) => {
        // Tạo dữ liệu cho mã QR code từ thông tin vé
        const qrCodeData = {
          ticketCode: ticket.ticketCode,
          user: ticket.user,
          priority: ticket.priority,
          ticketType: ticket.ticketType,
          month: ticket.month,
        };
        // Chuyển đổi dữ liệu thành chuỗi JSON
        const jsonData = JSON.stringify(qrCodeData);
        // Sinh QR code từ dữ liệu
        const qrCode = await QRCode.toDataURL(jsonData);
        return qrCode;
      })
    );
    return res.json({ qrCodes });
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
