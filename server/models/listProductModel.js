const { DataTypes: dt } = require("sequelize");
const UserListModel = require("./userListModel");
const ProductModel = require("./productModel");
const db = require("./index");

const ListProductModel = db.define("ListProduct", {});

UserListModel.belongsToMany(ProductModel, {
  through: ListProductModel,
  foreignKey: {
    name: "listId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
ProductModel.belongsToMany(UserListModel, {
  through: ListProductModel,
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

module.exports = ListProductModel;
