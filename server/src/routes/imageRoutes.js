const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadImage,
  getImagesByRoom,
  getImageById
} = require("../controllers/imageController");

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("image"), uploadImage);
router.get("/:roomId", authMiddleware, getImagesByRoom);
router.get("/by-id/:id", authMiddleware, getImageById);

module.exports = router;