const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProperties,
  createProperty,
  getPropertyById
} = require("../controllers/propertyController");

const router = express.Router();

router.get("/", authMiddleware, getProperties);
router.post("/", authMiddleware, createProperty);
router.get("/:id", authMiddleware, getPropertyById);

module.exports = router;