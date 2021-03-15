const { DataTypes: dt } = require("sequelize");
const db = require("./index");
const NotificationModel = require("./notificationModel");
const UserModel = require("./userModel");

const UserNotificationModel = db.define("UserNotifications", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isRead: {
    type: dt.BOOLEAN,
    defaultValue: false,
  },
});

NotificationModel.hasMany(UserNotificationModel, {
  foreignKey: {
    name: "notification_id",
    allowNull: false,
  },
});

UserModel.hasMany(UserNotificationModel, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
});

module.exports = UserNotificationModel;
