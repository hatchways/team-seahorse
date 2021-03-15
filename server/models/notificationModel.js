const { DataTypes: dt } = require("sequelize");
const db = require("./index");

const NotificationModel = db.define("Notification", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
});

module.exports = NotificationModel;
