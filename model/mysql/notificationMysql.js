const sequelize = require("../../index");
const { DataTypes } = require("sequelize");

const Notification = sequelize.define(
  "Notification",
  {
    type: {
      type: DataTypes.ENUM("email", "sms", "push"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipients: {
      type: DataTypes.JSON, // because it's an array of objects
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true, // required only if type = email (handle this in code)
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true, // required only if type = push (handle this in code)
    },
    status: {
      type: DataTypes.ENUM("Sent", "Failed", "Pending"),
      allowNull: false,
      defaultValue: "Sent",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = Notification;
