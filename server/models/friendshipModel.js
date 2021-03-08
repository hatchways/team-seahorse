const { DataType: dt } = require("sequelize");
const db = require("./index");

const FriendshipModel = db.define("FriendshipModel", {
	id: {
		type: dt.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	}
});

module.exports = FriendshipModel;
