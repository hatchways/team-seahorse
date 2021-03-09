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

module.exports = ListProductModel;
