const { DataTypes: dt } = require("sequelize");
const UserModel = require("./userModel");
const db = require("./index");

const UserFollowerModel = db.define("UserFollower", {});
UserModel.belongsToMany(UserModel, {
  through: UserFollowerModel,
  as: "FollowerUser",
  foreignKey: {
    name: "followerId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
UserModel.belongsToMany(UserModel, {
  through: UserFollowerModel,
  as: "FollowedUser",
  foreignKey: {
    name: "followedId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

module.exports = UserFollowerModel;
