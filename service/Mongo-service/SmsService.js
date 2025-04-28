class SmsService {
  async sendNotification({ sender, recipients, content }) {
    console.log("Sending SMS Notification...");
    // Logic to send SMS
    return {
      type: "sms",
      sender,
      recipients,
      content,
      status: "Sent",
    };
  }
}

module.exports = SmsService;