const prisma = require("../utils/prisma");

const createRoom = async (req, res) => {
  try {
    const { name, propertyId } = req.body;

    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        userId: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const room = await prisma.room.create({
      data: {
        name,
        propertyId
      }
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: {
          userId: req.user.id
        }
      }
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createRoom,
  getRoomById
};