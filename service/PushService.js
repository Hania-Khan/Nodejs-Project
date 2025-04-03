class PushService {
  async sendNotification({ sender, recipients, title, content }) {
    console.log("Sending Push Notification...");

    // Dummy device token for testing if not provided
    const dummyDeviceToken =
      "c8f7e7f8d7b3a4f56e6a2f3a5b39e16f2f8a6df33bb19c1b6f3deae6abf01875";

    const processedRecipients = recipients.map((recipient) => {
      // If recipient is a string, use it directly; if it's an object, take deviceToken property.
      if (typeof recipient === "string") {
        return { deviceToken: recipient };
      } else if (typeof recipient === "object" && recipient.deviceToken) {
        return recipient;
      } else {
        return { deviceToken: dummyDeviceToken };
      }
    });

    // Return a dummy result
    return {
      type: "push",
      sender,
      recipients: processedRecipients,
      title,
      content,
      status: "Sent",
    };
  }
}

module.exports = PushService;
