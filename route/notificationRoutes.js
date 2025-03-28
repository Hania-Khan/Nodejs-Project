const express = require("express");
const { createNotification } = require("../controller/notificationController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/send", authenticate, createNotification);

module.exports = router;