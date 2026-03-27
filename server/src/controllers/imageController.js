const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const prisma = require("../utils/prisma");

// Upload image to Cloudinary
const uploadImage = async (req, res) => {
  try {
    const roomId = parseInt(req.body.roomId, 10);

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "leaseguard",
    });

    // Delete temp file from server
    fs.unlinkSync(req.file.path);

    // Save to DB
    const image = await prisma.image.create({
      data: {
        url: result.secure_url, // FULL URL from Cloudinary
        roomId,
      },
    });

    return res.status(201).json(image);
  } catch (error) {
    console.error("UPLOAD IMAGE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all images for a room
const getImagesByRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);

    const images = await prisma.image.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
    });

    res.json(images);
  } catch (error) {
    console.error("GET IMAGES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get image by ID (with annotations)
const getImageById = async (req, res) => {
  try {
    const imageId = parseInt(req.params.id, 10);

    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        annotations: true,
      },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(image);
  } catch (error) {
    console.error("GET IMAGE BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadImage,
  getImagesByRoom,
  getImageById,
};