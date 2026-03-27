const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createAnnotation,
  getAnnotationsByImage
} = require("../controllers/annotationController");

const router = express.Router();

router.post("/", authMiddleware, createAnnotation);
router.get("/:imageId", authMiddleware, getAnnotationsByImage);

module.exports = router;