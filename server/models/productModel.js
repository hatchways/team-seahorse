const { DataTypes: dt } = require("sequelize");
const db = require("./index");

const ProductModel = db.define("Product", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  current_price: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
  },
  previous_price: {
    type: dt.DECIMAL(10, 2),
  },
  link: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  company: {
    type: dt.STRING,
    allowNull: false,
  },
  is_still_available: {
    type: dt.BOOLEAN,
    allowNull: false,
  },
});

//Creates a Products table if one does not already exist.
ProductModel.sync();
module.exports = ProductModel;
