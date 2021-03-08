const { DataType: dt } = require("sequelize");
const UserModel = require("./userModel");
const db = require("./index");

const FriendRequestModel = db.define("FriendRequestModel", {
	id: {
		type: dt.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	from_id: {
		type: dt.INTEGER,
		allowNull: false,
		references: {
			model: UserModel,
			key: "id",
		},
	},
	to_id: {
		type: dt.INTEGER,
		allowNull: false,
		references: {
			model: UserModel,
			key: "id",
		},
	},
});

module.exports = FriendRequestModel;
