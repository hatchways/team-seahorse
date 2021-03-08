const { DataType: dt } = require("sequelize");
const ProductListModel = require("./productListModel");
const UserModel = require("./userModel");
const db = require("./index");

const ListFollowerModel = db.define("ListFollower", {
	id: {
		type: dt.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	user_id: {
		type: dt.INTEGER,
		allowNull: false,
		references: {
			model: UserModel,
			key: "id",
		},
	},
	list_id: {
		type: dt.INTEGER,
		allowNull: false,
		references: {
			model: UserListModel,
			key: "id",
		},
	},
});

module.exports = ListFollowerModel;
