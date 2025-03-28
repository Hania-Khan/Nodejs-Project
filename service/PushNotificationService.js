class PushService {
  async sendNotification({ sender, recipients, title, content }) {
    console.log("Sending Push Notification...");
    // Logic to send push notification
    return {
      type: "push",
      sender,
      recipients,
      title,
      content,
      status: "Sent",
    };
  }
}

module.exports = PushService;