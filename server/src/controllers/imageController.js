const prisma = require("../utils/prisma");

const uploadImage = async (req, res) => {
  try {
    console.log("UPLOAD BODY:", req.body);
    console.log("UPLOAD FILE:", req.file);
    console.log("AUTH USER:", req.user);

    const roomId = parseInt(req.body.roomId, 10);

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    if (!roomId || Number.isNaN(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

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

    const image = await prisma.image.create({
      data: {
        url: `/uploads/${req.file.filename}`,
        roomId
      }
    });

    return res.status(201).json(image);
  } catch (error) {
    console.error("UPLOAD IMAGE ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getImagesByRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: {
          userId: req.user.id
        }
      },
      include: {
        images: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.json(room.images);
  } catch (error) {
    console.error("GET IMAGES ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
const getImageById = async (req, res) => {
  try {
    const imageId = parseInt(req.params.id, 10);

    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        room: {
          property: {
            userId: req.user.id
          }
        }
      }
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.json(image);
  } catch (error) {
    console.error("GET IMAGE BY ID ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
module.exports = {
  uploadImage,
  getImagesByRoom,
  getImageById
};