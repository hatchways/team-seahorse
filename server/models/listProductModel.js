const { DataTypes: dt } = require("sequelize");
const UserListModel = require("./userListModel");
const ProductModel = require("./productModel");
const db = require("./index");

const ListProductModel = db.define("ListProduct", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

UserListModel.hasMany(ListProductModel, {
  foreignKey: {
    name: "list_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});
ProductModel.hasMany(ListProductModel, {
  foreignKey: {
    name: "product_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});

module.exports = ListProductModel;
