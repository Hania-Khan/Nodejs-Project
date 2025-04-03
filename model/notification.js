const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["email", "sms", "push"],
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    recipients: [
      {
        email: {
          type: String,
        },
        deviceToken: {
          type: String,
          required: function () {
            return this.type === "push"; // Only required if it's a push notification
          },
        },
      },
    ],
    phoneNumber: {
      type: String,
      required: function () {
        return this.type === "sms";
      },
    },
    emailaddress: {
      type: String,
      required: function () {
        return this.type === "email";
      },
    },
    subject: {
      type: String,
      required: function () {
        return this.type === "email";
      },
    },
    title: {
      type: String,
      required: function () {
        return this.type === "push";
      },
    },
    status: {
      type: String,
      enum: ["Sent", "Failed", "Pending"],
      default: "Sent",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
