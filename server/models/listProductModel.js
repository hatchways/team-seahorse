const { DataTypes: dt } = require("sequelize");
const UserListModel = require("./userListModel");
const ProductModel = require("./productModel");
const db = require("./index");

const ListProductModel = db.define("ListProduct", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

UserListModel.hasMany(ListProductModel, {
  foreignKey: {
    name: "list_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});
ProductModel.hasMany(ListProductModel, {
  foreignKey: {
    name: "product_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});

//TODO: Test this feature with the lists router.
//Checks to see if the product still exists in other lists. If it doesn't, the product is removed from the database.
ListProductModel.afterDestroy(async (listProduct, options) => {
  const { transaction } = options;
  const productStillExistsInOtherLists =
    (await ListProductModel.count({
      where: { product_id: productId },
      transaction,
    })) == 1;
  if (!productStillExistsInOtherLists) {
    await ProductModel.destroy({
      where: { id: productId },
      transaction,
    });
  }
});

module.exports = ListProductModel;
