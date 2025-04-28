const EmailService = require("./EmailService");
const SmsService = require("./SmsService");
const PushService = require("./PushService");

class NotificationService {
  static getNotificationService(type) {
    switch (type) {
      case "email":
        return new EmailService();
      case "sms":
        return new SmsService();
      case "push":
        return new PushService();
      default:
        throw new Error(`Notification type "${type}" is not supported`);
    }
  }
}

module.exports = NotificationService;
