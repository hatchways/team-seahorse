const { DataType: dt } = require("sequelize");
const UserModel = require("./userModel");
const FriendshipModel = require("./friendshipModel");
const db = require("./index");

const UserFriendModel = db.define("UserFriendModel", {
	id: {
		type: dt.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	user_id: {
		type: dt.INTEGER,
		allowNull: false,
		references: {
			model: UserFriendModel,
			key: "id",
		},
	},
	friendship_id: {
		type: dt.INTEGER,
		allowNull: false,
		references: {
			model: FriendshipModel,
			key: "id",
		},
	},
});

module.exports = UserFriendModel;
