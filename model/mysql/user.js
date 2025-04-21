const { DataTypes } = require("sequelize");
const sequelize = require("../../index");

const UserMySQL = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailaddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobileNumber:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING, // We'll store as comma-separated string
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

module.exports = UserMySQL;
