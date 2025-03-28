class EmailService {
  async sendNotification({ sender, recipients, subject, content }) {
    console.log("Sending Email Notification...");
    // Logic to send email
    return {
      type: "email",
      sender,
      recipients,
      subject,
      content,
      status: "Sent",
    };
  }
}

module.exports = EmailService;