const Notification = require("../model/notification");
const NotificationService = require("../service/notificationService");

exports.createNotification = async (req, res) => {
  try {
    console.log("Received request body:", JSON.stringify(req.body, null, 2));

    // Check if recipients exist and is an array
    if (!req.body.recipients || !Array.isArray(req.body.recipients)) {
      return res.status(400).json({ message: "Recipients must be an array." });
    }

    // Get user roles
    const userRoles = req.user.roles || [];
    console.log("User Roles:", userRoles);

    // Define allowed roles for each notification type
    const allowedNotificationRoles = {
      email: "email-sender",
      sms: "sms-sender",
      push: "push-sender",
    };

    const requiredRole = allowedNotificationRoles[req.body.type];

    if (!userRoles.includes(requiredRole)) {
      console.log(`User does not have permission to send ${req.body.type} notifications`);
      return res.status(403).json({
        message: `You do not have the required role to send ${req.body.type} notifications.`,
      });
    }

    // Prepare recipients based on type
    let recipients = [];
    if (req.body.type === "email") {
      recipients = req.body.recipients.map((r) => ({ email: r.email })); // FIXED: Access email properly
    } else if (req.body.type === "sms") {
      recipients = req.body.recipients.map((r) => ({ phoneNumber: r.phoneNumber })); // FIXED: Access phoneNumber properly
    } else if (req.body.type === "push") {
      recipients = req.body.recipients.map((r) => ({ deviceToken: r.deviceToken })); // FIXED: Access deviceToken properly
    }

    console.log("Final Recipients Array:", recipients);

    if (recipients.length === 0) {
      return res.status(400).json({ message: "Recipients cannot be empty." });
    }

    // Get the sender information
    const sender = req.user.email || req.user.phone || req.user.id;

    // Use the correct notification service
    const notificationService = NotificationService.getNotificationService(req.body.type);

    // Send notification
    const result = await notificationService.sendNotification({
      sender,
      recipients,
      subject: req.body.subject || "",
      content: req.body.content,
      title: req.body.title || "",
    });

    // Create and save the notification
    const notification = new Notification({
      type: req.body.type,
      content: req.body.content,
      recipients, // FIXED: Now correctly formatted
      subject: req.body.subject || null,
      title: req.body.title || null,
      status: "Sent",
    });

    console.log("Saving notification to DB:", notification);
    await notification.save();

    res.status(201).json({
      message: `${
        req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1)
      } notification sent successfully`,
      result,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET: Retrieve all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET: Retrieve a single notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// PUT: Update a notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification updated successfully",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE: Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
      notification: deletedNotification,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

