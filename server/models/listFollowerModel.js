const { DataTypes: dt } = require("sequelize");
const UserModel = require("./userModel");
const UserListModel = require("./userListModel");
const db = require("./index");

const ListFollowerModel = db.define("ListFollower", {});
UserModel.belongsToMany(UserListModel, {
  through: ListFollowerModel,
  foreignKey: {
    name: "followerId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
UserListModel.belongsToMany(UserModel, {
  through: ListFollowerModel,
  foreignKey: {
    name: "followedId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

module.exports = ListFollowerModel;
