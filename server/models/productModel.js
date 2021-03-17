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
  },
  previous_price: {
    type: dt.DECIMAL(10, 2),
  },
  name: {
    type: dt.STRING,
    allowNull: false,
  },
  link: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  image_url: {
    type: dt.STRING,
    allowNull: false,
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

module.exports = ProductModel;
