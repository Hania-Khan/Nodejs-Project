const express = require("express");
const {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require("../../controller/mongo/notificationControllerMongo");
const {
  authenticate,
  validateNotificationRequest,
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/send",
  authenticate,
  validateNotificationRequest,
  createNotification
);

// New Routes
router.get("/", authenticate, getAllNotifications);
router.get("/:id", authenticate, getNotificationById);
router.put("/:id", authenticate, updateNotification);
router.delete("/:id", authenticate, deleteNotification);

module.exports = router;
