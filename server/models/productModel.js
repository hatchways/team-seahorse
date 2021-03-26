const { DataTypes: dt } = require("sequelize");
const db = require("./index");

const ProductModel = db.define("Product", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  currentPrice: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
  },
  previousPrice: {
    type: dt.DECIMAL(10, 2),
  },
  name: {
    type: dt.STRING,
    allowNull: false,
  },
  link: {
    type: dt.STRING(512),
    allowNull: false,
    unique: true,
  },
  imageUrl: {
    type: dt.STRING,
    allowNull: false,
  },
  company: {
    type: dt.STRING,
    allowNull: false,
  },
  isStillAvailable: {
    type: dt.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ProductModel;
