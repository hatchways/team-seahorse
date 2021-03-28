const { Op } = require("sequelize");
const express = require("express");
const {
  validate,
  listIdCheck,
  titleCheck,
  imageUrlCheck,
  titleOrImageUrlCheck,
  giveServerError,
} = require("../middlewares/validate");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const db = require("../models");
const ListProductModel = require("../models/listProductModel");
const UserListModel = require("../models/userListModel");
const ProductModel = require("../models/productModel");

//Returns id of each list belonging to the user.
const getLists = async (req, res) => {
  try {
    const results = await UserListModel.findAll({
      attributes: ["id", "title", "items", "imageUrl", "isPrivate"],
      where: { userId: req.user.id },
    });
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    giveServerError(res);
  }
};

//Returns product information for a given list belonging to the user.
const getList = async (req, res) => {
  //Queries all the products of each list, as well as the link for each of those products, and the user each of those
  //lists belongs to. Only returns products of the specified list, and only if that list belongs to the user.
  try {
    const [results] = await db.query(`
        SELECT "Products".name, "Products".link, "Products".id, "Products"."currentPrice", "Products"."previousPrice" FROM "ListProducts" 
        JOIN "Products" ON ("ListProducts"."productId" = "Products".id)
        JOIN "UserLists" ON ("ListProducts"."listId" = "UserLists".id)
        WHERE ( "ListProducts"."listId" = ${parseInt(
          req.params.listId
        )} AND "UserLists"."userId" = ${req.user.id} )
    `);
    //If no products are found, we check if the list even exists as belonging to the user (since we get the same result
    //if the list is empty). If the list doesn't exist as belonging to the user, we return a 400 error.
    if (results.length == 0) {
      const listExists =
        (await UserListModel.count({
          where: { id: parseInt(req.params.listId), userId: req.user.id },
        })) == 1;
      if (!listExists) {
        res.status(400).send({ errors: [{ msg: "No list with given ID." }] });
        return;
      }
    }
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    giveServerError(res);
  }
};

//Creates a list belonging to the user.
const createList = async (req, res) => {
  try {
    const result = await UserListModel.create({
      userId: req.user.id,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
    });
    res.status(201).send({ id: result.id });
  } catch (error) {
    console.error(error);
    //TODO: Currently throws error if a server error happens since error.error[0] might not exist
    //If title is not unique
    if (
      "errors" in error &&
      error.errors[0].type == "unique violation" &&
      error.errors[0].path == "title"
    ) {
      res.status(400).send({ errors: [{ msg: "title must be unique." }] });
    }
    giveServerError(res);
  }
};

//Change title and cover image url in list belonging to the user.
const changeList = async (req, res) => {
  try {
    const [affectedRows] = await UserListModel.update(
      {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        isPrivate: req.body.isPrivate,
      },
      {
        where: {
          id: parseInt(req.params.listId),
          userId: req.user.id,
        },
      }
    );
    if (affectedRows == 0) {
      res.status(400).send({ errors: [{ msg: "No list with given ID." }] });
      return;
    }
    res.status(201).send({ message: "list updated successfully" });
  } catch (error) {
    console.error(error);
    //If title is not unique
    if (
      error.errors[0].type == "unique violation" &&
      error.errors[0].path == "title"
    ) {
      res.status(400).send({ errors: [{ msg: "title must be unique." }] });
    }
    giveServerError(res);
  }
};

//Deletes list belonging to the user.
const deleteList = async (req, res) => {
  let transaction = null;
  try {
    transaction = await db.transaction();
    //Deletes the list.
    const affectedRows = await UserListModel.destroy({
      where: {
        id: parseInt(req.params.listId),
        userId: req.user.id,
      },
      transaction,
    });
    //Returns a 400 error if there wasn't a list to delete.
    if (affectedRows == 0) {
      res.status(400).send({ errors: [{ msg: "No list with given ID." }] });
      return;
    }
    //Finds all products that aren't associated with a list.
    const listlessProductIds = (
      await ProductModel.findAll({
        where: {
          "$UserLists.id$": {
            [Op.is]: null,
          },
        },
        include: {
          model: UserListModel,
        },
        transaction,
      })
    ).map((productObj) => productObj.id);
    //Deletes all products no longer associated with a list.
    await ProductModel.destroy({
      where: { id: listlessProductIds },
      transaction,
    });
    await transaction.commit();
    res.status(200).send();
  } catch (error) {
    console.error(error);
    giveServerError(res);
    if (transaction != null) await transaction.rollback();
  }
};

router.use(authMiddleware);
router.get("/", getLists);
router.get("/:listId", [listIdCheck, validate, getList]);
router.post("/", [titleCheck, imageUrlCheck, validate, createList]);
router.put("/:listId", [
  listIdCheck,
  titleOrImageUrlCheck,
  validate,
  changeList,
]);
router.delete("/:listId", [listIdCheck, validate, deleteList]);

module.exports = router;
