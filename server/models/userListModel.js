const { DataTypes: dt } = require("sequelize");
const UserModel = require("./userModel");
const db = require("./index");

const UserListModel = db.define("UserList", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: dt.STRING(32),
    allowNull: false,
    unique: "uniqueTitleForUser",
  },
  imageUrl: {
    type: dt.STRING(128),
    allowNull: true,
  },
  items: {
    type: dt.INTEGER,
    defaultValue: 0,
  },
});

UserModel.hasMany(UserListModel, {
  foreignKey: {
    name: "userId",
    allowNull: false,
    unique: "uniqueTitleForUser",
  },
  onDelete: "CASCADE",
});

module.exports = UserListModel;
