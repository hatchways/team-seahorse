const { DataTypes: dt } = require("sequelize");
const db = require("./index");

const ProductModel = db.define("Product", {
	id: {
		type: dt.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	lastKnownPrice: {
		type: dt.DECIMAL(10, 2),
		allowNull: false,
	},
	priceDrop: {
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
	soldOut: {
		type: dt.BOOLEAN,
		allowNull: false,
	},
});

module.exports = ProductModel;
