const express = require("express");
const { createNotification } = require("../controller/notificationController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", authenticate, async (req, res, next) => {
  try {
    await createNotification(req, res); // Call your controller function
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
});

module.exports = router;
