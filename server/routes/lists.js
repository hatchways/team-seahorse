const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const db = require("../models");
const ListProductModel = require("../models/listProductModel");
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
    const [[result]] = await db.query(`
        SELECT "Products".name, "Products".link, "Products".id FROM "ListProducts" 
        JOIN "Products" ON ("ListProducts".product_id = "Products".id)
        JOIN "UserLists" ON ("ListProducts".list_id = "UserLists".id)
        WHERE ( "ListProducts".list_id = ${req.params.listId} AND "ListProducts".user_id = ${req.user} )
    `);
    if (result == null) {
      throw "no list found";
    }
    res.status(200).send(JSON.stringify(result));
  } catch {
    res.status(500).send();
  }
});

//Creates a list belonging to the user.
router.post("/", async (req, res) => {
  try {
    const result = await UserList.create({
      user_id: req.user,
      title: req.body.title,
    });
    res.status(201).send(result.id);
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
      for (let i = 0; i < productIds; i++) {
        const productId = productIds[i];
        await db.query(`
          DELETE FROM "ListProducts"
          USING "UserLists"
          WHERE (
            "ListProducts".list_id = "UserLists".id
            AND "ListProducts".product_id = ${productId} AND "ListProducts".list_id = ${req.params.listId}
            AND "UserLists".user_id = ${req.user}
          )
        `);
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
      }
    }
    await transaction.commit();
    res.status(201).send();
  } catch {
    res.status(500).send();
    await transaction.rollback();
  }
});

//Deletes list belonging to the user.
router.delete("/:listId", async (req, res) => {
  try {
    const affectedRows = await UserList.destroy({
      where: {
        id: req.params.listId,
        user_id: req.user,
      },
    });
    if (affectedRows == 0) {
      throw "noRowDeleted";
    }
    res.status(200).send();
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
