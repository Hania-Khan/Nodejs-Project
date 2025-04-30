const { DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("email", "sms", "push"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipients: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Sent", "Failed", "Pending"),
      allowNull: false,
      defaultValue: "Sent",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Notification;
