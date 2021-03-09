const { DataType: dt } = require("sequelize");
const UserModel = require("./userModel");
const db = require("./index");

const UserListModel = db.define("UserList", {
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
  title: {
    type: dt.STRING(32),
    allowNull: false,
  },
});

//Creates a UserLists table if one does not already exist.
UserListModel.sync();
module.exports = UserListModel;
