import TicketType from "../models/TicketType.js";

// Lấy danh sách tất cả các vé
const getAllTicketType = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find();
    res.status(200).json(ticketTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTicketTypeById = async (req, res) => {
  try {
    const ticketType = await TicketType.findById(req.params.id); 
    if (!ticketType) {
      return res.status(404).json({ message: "Couldn't find ticket type" });
    }
    res.status(200).json(ticketType); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createTicketType = async (req, res) => {
  
  const { priority, routeType, period, cost } = req.body;
  
  const ticketType = new TicketType({
    priority,
    routeType,
    period,
    cost,
  });

  try {
    const newTicketType = await ticketType.save();
    res.status(201).json(newTicketType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateTicketType = async (req, res) => {
  const { priority, routeType, period, cost } = req.body;
  const ticketTypeId = req.params.id;

  try {
    const ticketType = await TicketType.findByIdAndUpdate(
      ticketTypeId,
      { $set: { priority, routeType, period, cost }},
      { new: true }
    );
    if (!ticketType) {
      return res.status(404).json({ message: "Couldn't find ticket type" });
    }

    res.json(ticketType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTicketType = async (req, res) => {
  const ticketTypeId = req.params.id;

  try {
    const ticketType = await TicketType.findByIdAndDelete(ticketTypeId);

    if (!ticketType) {
      return res.status(404).json({ message: "Couldn't find ticket type" });
    }

    res.json({ message: "Deleted ticket type successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getAllTicketType,
  getTicketTypeById,
  createTicketType,
  updateTicketType,
  deleteTicketType,
};
