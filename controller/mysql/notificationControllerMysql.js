const NotificationMySQL = require("../model/mysql/notification");
const NotificationService = require("../service/Mongo-service/notificationService"); // Reuse same NotificationService

exports.createNotification = async (req, res) => {
  try {
    console.log("Received request body:", JSON.stringify(req.body, null, 2));

    if (!req.body.recipients || !Array.isArray(req.body.recipients)) {
      return res.status(400).json({ message: "Recipients must be an array." });
    }

    const userRoles = req.user.roles || [];
    const allowedNotificationRoles = {
      email: "email",
      sms: "sms",
      push: "push",
    };

    const requiredRole = allowedNotificationRoles[req.body.type];
    if (!userRoles.includes(requiredRole)) {
      return res.status(403).json({
        message: `You do not have the required role to send ${req.body.type} notifications.`,
      });
    }

    // Set sender based on type
    let sender;
    if (req.body.type === "email") {
      sender = req.user.email;
    } else if (req.body.type === "sms") {
      sender = req.user.phoneNumber;
    } else if (req.body.type === "push") {
      sender = req.user.deviceToken;
    }

    if (!sender) {
      return res.status(400).json({
        message: `Sender info for ${req.body.type} is missing in user data.`,
      });
    }

    let recipients = [];
    if (req.body.type === "email") {
      recipients = req.body.recipients.map((r) => ({ email: r.email }));
    } else if (req.body.type === "sms") {
      recipients = req.body.recipients.map((r) => ({
        phoneNumber: r.phoneNumber,
      }));
    } else if (req.body.type === "push") {
      recipients = req.body.recipients.map((r) => ({
        deviceToken: r.deviceToken,
      }));
    }

    if (recipients.length === 0) {
      return res.status(400).json({ message: "Recipients cannot be empty." });
    }

    const notificationService = NotificationService.getNotificationService(
      req.body.type
    );

    const result = await notificationService.sendNotification({
      sender,
      recipients,
      subject: req.body.subject || "",
      content: req.body.content,
      title: req.body.title || "",
    });

    const notification = await NotificationMySQL.create({
      type: req.body.type,
      content: req.body.content,
      recipients, // Sequelize handles JSON automatically
      subject: req.body.subject || null,
      title: req.body.title || null,
      status: "Sent",
    });

    res.status(201).json({
      message: `${
        req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1)
      } notification sent successfully`,
      result,
      notification,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// GET: Retrieve all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationMySQL.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// GET: Retrieve a single notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await NotificationMySQL.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// PUT: Update a notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const [updatedRowsCount, updatedRows] = await NotificationMySQL.update(
      req.body,
      {
        where: { id: req.params.id },
        returning: true,
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification updated successfully",
      notification: updatedRows[0], // first updated record
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// DELETE: Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const deletedRowsCount = await NotificationMySQL.destroy({
      where: { id: req.params.id },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
