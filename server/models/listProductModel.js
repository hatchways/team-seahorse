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
  list_id: {
    type: dt.INTEGER,
    allowNull: false,
    references: {
      model: UserListModel,
      key: "id",
    },
  },
  product_id: {
    type: dt.INTEGER,
    allowNull: false,
    references: {
      model: ProductModel,
      key: "id",
    },
  },
});

UserListModel.hasMany(ListProductModel, {
  foreignKey: {
    name: "list_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
ProductModel.hasMany(ListProductModel, {
  foreignKey: {
    name: "product_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

module.exports = ListProductModel;
