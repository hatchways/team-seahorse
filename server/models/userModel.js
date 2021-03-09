const { DataTypes: dt } = require("sequelize");
const crypto = require("crypto");
const db = require("./index");

const UserModel = db.define("User", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: dt.STRING,
    allowNull: false,
  },
  email: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: dt.STRING,
    allowNull: false,
    //Prevents this field from showing up in findAll and findById queries
    get() {
      return () => this.getDataValue("password");
    },
  },
  salt: {
    type: dt.STRING,
    //Prevents this field from showing up in findAll and findById queries
    get() {
      return () => this.getDataValue("salt");
    },
  },
});

const hashAndSalt = function (password, salt) {
  return crypto
    .createHash("RSA-SHA256")
    .update(password)
    .update(salt)
    .digest("hex");
};

const setSaltAndPassword = function (user) {
  if (user.changed("password")) {
    user.salt = crypto.randomBytes(16).toString("base64");
    user.password = hashAndSalt(user.password(), user.salt());
  }
};

UserModel.beforeCreate(setSaltAndPassword);
UserModel.beforeUpdate(setSaltAndPassword);

//Returns true if given password matches the password of the user object.
UserModel.prototype.isPasswordCorrect = function (givenPassword) {
  return hashAndSalt(givenPassword, this.salt()) == this.password();
};

//Creates a Users table if one does not already exist.
UserModel.sync();
module.exports = UserModel;
