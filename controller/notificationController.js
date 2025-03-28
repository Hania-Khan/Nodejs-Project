const NotificationService = require("../service/notificationService");
const { validateNotificationRequest } = require("../middleware/authMiddleware");

exports.createNotification = async (req, res) => {
  try {
    const { type, subject, content, recipient, title } = req.body;

    const { error } = validateNotificationRequest({ type, subject, content, recipient, title });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const sender = req.user.email || req.user.phone || req.user.id;

    const notificationService = NotificationService.getNotificationService(type);

    const result = await notificationService.sendNotification({
      sender,
      recipients: Array.isArray(recipient) ? recipient : [recipient],
      subject,
      content,
      title,
    });

    res.status(201).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} notification sent successfully`,
      result,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};