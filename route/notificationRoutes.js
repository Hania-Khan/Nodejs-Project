const express = require("express");
const { createNotification } = require("../controller/notificationController");
const { authenticate, validateNotificationRequest } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", authenticate, validateNotificationRequest, createNotification);

module.exports = router;
