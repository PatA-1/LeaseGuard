const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createRoom, getRoomById } = require("../controllers/RoomController");

const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.get("/:id", authMiddleware, getRoomById);

module.exports = router;