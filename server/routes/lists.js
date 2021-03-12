const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const db = require("../models");
const ListProductModel = require("../models/listProductModel");
const UserList = require("../models/userListModel");
const ProductModel = require("../models/productModel");

//TODO: Add validations.

router.use(authMiddleware);

//Returns information for each list belonging to the user.
router.get("/", async (req, res) => {
  try {
    const results = await UserList.findAll({
      attributes: ["id"],
      where: { user_id: req.user.id },
    });
    res.status(200).send(JSON.stringify(results));
  } catch (error) {
    res.status(500).send();
  }
});

//Returns product information for a given list belonging to the user.
router.get("/:listId", async (req, res) => {
  //Queries all the products of each list, as well as the link for each of those products, and the user each of those
  //lists belongs to. Only returns products of the specified list, and only if that list belongs to the user.
  try {
    const [results] = await db.query(`
        SELECT "Products".name, "Products".link, "Products".id FROM "ListProducts" 
        JOIN "Products" ON ("ListProducts".product_id = "Products".id)
        JOIN "UserLists" ON ("ListProducts".list_id = "UserLists".id)
        WHERE ( "ListProducts".list_id = ${parseInt(
          req.params.listId
        )} AND "UserLists".user_id = ${req.user.id} )
    `);
    res.status(200).send(JSON.stringify(results));
  } catch (error) {
    res.status(500).send();
  }
});

//Creates a list belonging to the user.
router.post("/", async (req, res) => {
  try {
    const result = await UserList.create({
      user_id: req.user.id,
      title: req.body.title,
    });
    res.status(201).send({ id: result.id });
  } catch (error) {
    res.status(500).send();
  }
});

//Change title in list belonging to the user.
router.put("/:listId", async (req, res) => {
  try {
    //Change the title of the list.
    if (req.body.title != null) {
      //TODO: throw error if affectedRows is 0.
      const [affectedRows] = await UserList.update(
        { title: req.body.title },
        {
          where: {
            id: parseInt(req.params.listId),
            user_id: req.user.id,
          },
        }
      );
    }
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

//Deletes list belonging to the user.
router.delete("/:listId", async (req, res) => {
  let transaction = null;
  try {
    transaction = await db.transaction();
    const affectedRows = await UserList.destroy({
      where: {
        id: parseInt(req.params.listId),
        user_id: req.user.id,
      },
      transaction,
    });
    if (affectedRows == 0) {
      throw "noRowDeleted";
    }
    const listlessProductIds = (
      await ProductModel.findAll({
        where: {
          "$ListProducts.product_id$": {
            [Op.is]: null,
          },
        },
        include: [
          {
            model: ListProductModel,
          },
        ],
        transaction,
      })
    ).map((productObj) => productObj.id);
    await ProductModel.destroy({
      where: { id: listlessProductIds },
      transaction,
    });
    await transaction.commit();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
    if (transaction != null) await transaction.rollback();
  }
});

module.exports = router;
