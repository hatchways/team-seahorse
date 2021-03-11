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
  },
});

UserModel.hasMany(UserListModel, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});

module.exports = UserListModel;
