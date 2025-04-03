const NotificationService = require("../service/notificationService");
const { validateNotificationRequest } = require("../middleware/authMiddleware"); // ✅ Ensure this import is present

exports.createNotification = async (req, res) => {
  try {
    // Validate the notification request
    const validationError = validateNotificationRequest(req, res, (err) => err);
    if (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    // Get the authenticated user's roles
    const userRoles = req.user.roles;

    // Define role-based permissions for sending notifications
    const allowedNotificationRoles = {
      email: "email-sender",
      sms: "sms-sender",
      push: "push-sender",
    };

    // Check if the user has the role to send the specified notification type
    const requiredRole = allowedNotificationRoles[req.body.type];
    if (!userRoles.includes(requiredRole)) {
      return res.status(403).json({
        message: `You do not have the required role to send ${req.body.type} notifications.`,
      });
    }

    // Proceed with notification sending
    const sender = req.user.email || req.user.phone || req.user.id;
    const notificationService = NotificationService.getNotificationService(req.body.type);

    const result = await notificationService.sendNotification({
      sender,
      recipients: Array.isArray(req.body.recipient) ? req.body.recipient : [req.body.recipient],
      subject: req.body.subject,
      content: req.body.content,
      title: req.body.title,
    });

    res.status(201).json({
      message: `${req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1)} notification sent successfully`,
      result,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
