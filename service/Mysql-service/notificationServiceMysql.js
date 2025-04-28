const NotificationMySQL = require("../../model/mysql/notification");
const { Op } = require("sequelize");

class NotificationServiceMySQL {
  // Create a new notification
  static async createNotification({ sender, recipients, type, title, content, status }) {
    const notification = await NotificationMySQL.create({
      sender,
      recipients,
      type,
      title,
      content,
      status
    });

    return notification;
  }

  // Get notification by ID
  static async getNotificationById(notificationId) {
    const notification = await NotificationMySQL.findByPk(notificationId);
    return notification;
  }

  // Update notification by ID
  static async updateNotification(notificationId, updates) {
    const notification = await NotificationMySQL.findByPk(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    const { sender, recipients, type, title, content, status } = updates;

    if (sender) notification.sender = sender;
    if (recipients) notification.recipients = recipients;
    if (type) notification.type = type;
    if (title) notification.title = title;
    if (content) notification.content = content;
    if (status) notification.status = status;

    await notification.save();
    return notification;
  }

  // Delete notification by ID
  static async deleteNotificationById(notificationId) {
    const deletedCount = await NotificationMySQL.destroy({ where: { id: notificationId } });
    return deletedCount; // Returns the number of deleted rows
  }

  // Get all notifications (optional filter by sender or type)
  static async getNotifications(filter = {}) {
    const whereClause = {};

    if (filter.sender) {
      whereClause.sender = { [Op.iLike]: `%${filter.sender}%` };
    }

    if (filter.type) {
      whereClause.type = filter.type;
    }

    const notifications = await NotificationMySQL.findAll({ where: whereClause });
    return notifications;
  }
}

module.exports = NotificationServiceMySQL;
