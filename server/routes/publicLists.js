const express = require("express");
const router = express.Router();
const UserListModel = require("../models/userListModel");
const db = require("../models");

const getLists = async (req, res) => {
  try {
    const results = await UserListModel.findAll({
      attributes: ["id", "title", "items", "imageUrl", "isPrivate"],
      where: { isPrivate: false },
      order: ["id"],
    });
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
  }
};

const getProductsofList = async (req, res) => {
  const listId = req.params.listId;
  try {
    const listFound = await UserListModel.findOne({
      where: {
        id: listId,
        isPrivate: false,
      },
    });

    if (listFound) {
      const [products] = await db.query(`
        SELECT "Products".name, "Products".link, "Products".id, "Products"."currentPrice", "Products"."previousPrice" FROM "ListProducts" 
        JOIN "Products" ON ("ListProducts"."productId" = "Products".id)
        JOIN "UserLists" ON ("ListProducts"."listId" = "UserLists".id)
        WHERE ( "ListProducts"."listId" = ${parseInt(listId)} )
    `);
      res.status(200).send(products);
    }
  } catch (error) {}
};

router.get("/", getLists);
router.get("/:listId", getProductsofList);

module.exports = router;
