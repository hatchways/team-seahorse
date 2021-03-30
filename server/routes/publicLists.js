const express = require("express");
const router = express.Router();
const UserListModel = require("../models/userListModel");
const db = require("../models");

const getLists = async (req, res) => {
  const userId = req.params.userId;
  try {
    const results = await UserListModel.findAll({
      attributes: ["id", "title", "items", "imageUrl", "isPrivate", "userId"],
      where: { userId: userId, isPrivate: false },
      order: ["id"],
    });
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
  }
};

const getProductsofList = async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;
  try {
    const listFound = await UserListModel.findOne({
      where: {
        id: listId,
        isPrivate: false,
        userId: userId,
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
    } else {
      res.status(400).send({ error: { message: "You do not have access" } });
    }
  } catch (error) {
    console.error(error);
  }
};

router.get("/:userId", getLists);
router.get("/:userId/:listId", getProductsofList);

module.exports = router;
