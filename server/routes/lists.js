const express = require("express");
const { params, validationResult, cookie } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { transaction } = require("../models");
const db = require("../models");
const ListProductModel = require("../models/listProductModel");
const ProductModel = require("../models/productModel");
const UserList = require("../models/userListModel");

//TODO: Add validations.

router.use(authMiddleware);

//Returns information for each list belonging to the user.
router.get("/", async (req, res) => {
  try {
    const results = await UserList.findAll({
      attributes: ["id"],
      where: { user_id: req.user },
    });
    res.status(200).send(JSON.stringify(results));
  } catch {
    res.status(500).send();
  }
});

//Returns product information for a given list belonging to the user.
router.get("/:listId", async (req, res) => {
  //Queries all the products of each list, as well as the link for each of those products, and the user each of those
  //lists belongs to. Only returns products of the specified list, and only if that list belongs to the user.
  try {
    //TODO: Throw error if no list was found.
    const [results] = await db.query(`
        SELECT "Products".name, "Products".link, "Products".id FROM "ListProducts" 
        JOIN "Products" ON ("ListProducts".product_id = "Products".id)
        JOIN "UserLists" ON ("ListProducts".list_id = "UserLists".id)
        WHERE ( "ListProducts".list_id = ${req.params.listId} AND "ListProducts".user_id = ${req.user} )
    `);
    res.status(200).send(JSON.stringify(results));
  } catch {
    res.status(500).send();
  }
});

//Creates a list belonging to the user.
router.post("/", async (req, res) => {
  try {
    await UserList.create({
      user_id: req.user,
      title: req.body.title,
    });
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

//Change title and remove items in list belonging to the user.
router.put("/:listId", async (req, res) => {
  const transaction = await db.transaction();
  try {
    //Change the title of the list.
    if (req.body.title != null) {
      //TODO: throw error if affectedRows is 0.
      const [affectedRows] = await UserList.update(
        { title: req.body.title },
        {
          where: {
            user_id: req.user,
            list_id: req.params,
          },
          transaction,
        }
      );
    }
    if (req.body.products != null && req.body.products.delete != null) {
      const productIds = req.body.products.delete;
      //Removes each product, then checks to see if the product still exists in other lists. If it doesn't, the product
      //is removed from the database.
      for (let i = 0; i < productIds; i++) {
        const productId = productIds[i];
        await ListProductModel.destroy({
          where: { product_id: productId, list_id: req.params.listId },
          transaction,
        });
      }
    }
    await transaction.commit();
  } catch {
    res.status(500).send();
    await transaction.rollback();
  }
});

module.exports = router;
