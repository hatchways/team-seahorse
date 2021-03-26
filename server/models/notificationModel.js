const { DataTypes: dt } = require("sequelize");
const db = require("./index");
const UserModel = require("./userModel");

const NotificationModel = db.define("Notification", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: dt.STRING,
    allowNull: false,
  },
  data: {
    type: dt.JSON,
    allowNull: false,
  },
  isRead: {
    type: dt.BOOLEAN,
    allowNull: false,
  },
});

UserModel.hasMany(NotificationModel, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

module.exports = NotificationModel;