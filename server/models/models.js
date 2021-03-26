const db = require("./index");

//defines each model
const UserModel = require("./userModel");
const ProductModel = require("./productModel");
const UserListModel = require("./userListModel");
const ListProductModel = require("./listProductModel");
const UserFollowerModel = require("./userFollowerModel");
const NotificationModel = require("./notificationModel");

//Creates tables for each model if the table doesn't already exist.
db.sync();

module.exports = {
  UserModel,
  ProductModel,
  UserListModel,
  ListProductModel,
  UserFollowerModel,
  NotificationModel,
};
