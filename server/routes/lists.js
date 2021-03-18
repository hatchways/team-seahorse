const { Op } = require("sequelize");
const express = require("express");
const {
  validate,
  listIdCheck,
  titleCheck,
} = require("../middlewares/validate");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const db = require("../models");
const ListProductModel = require("../models/listProductModel");
const UserList = require("../models/userListModel");
const ProductModel = require("../models/productModel");
const upload = require("../services/imageUpload");
const uploadFile = upload.single("image");

const giveServerError = (res) =>
  res.status(500).send({ errors: [{ msg: "Server error" }] });

//Returns id of each list belonging to the user.
const getLists = async (req, res) => {
  try {
    const results = await UserList.findAll({
      attributes: ["id", "title"],
      where: { user_id: req.user.id },
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
        SELECT "Products".name, "Products".link, "Products".id FROM "ListProducts" 
        JOIN "Products" ON ("ListProducts".product_id = "Products".id)
        JOIN "UserLists" ON ("ListProducts".list_id = "UserLists".id)
        WHERE ( "ListProducts".list_id = ${parseInt(
          req.params.listId
        )} AND "UserLists".user_id = ${req.user.id} )
    `);
    //If no products are found, we check if the list even exists as belonging to the user (since we get the same result
    //if the list is empty). If the list doesn't exist as belonging to the user, we return a 400 error.
    if (results.length == 0) {
      const listExists =
        (await UserList.count({
          where: { id: parseInt(req.params.listId), user_id: req.user_id },
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
    const result = await UserList.create({
      user_id: req.user.id,
      title: req.body.title,
    });
    res.status(201).send({ id: result.id });
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

//Change title in list belonging to the user.
const changeList = async (req, res) => {
  try {
    const [affectedRows] = await UserList.update(
      { title: req.body.title },
      {
        where: {
          id: parseInt(req.params.listId),
          user_id: req.user.id,
        },
      }
    );
    if (affectedRows == 0) {
      res.status(400).send({ errors: [{ msg: "No list with given ID." }] });
      return;
    }
    res.status(201).send();
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
    const affectedRows = await UserList.destroy({
      where: {
        id: parseInt(req.params.listId),
        user_id: req.user.id,
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
          "$ListProducts.product_id$": {
            [Op.is]: null,
          },
        },
        include: [ListProductModel],
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

const uploadImage = async (req, res) => {
  const listId = req.params.listId;

  uploadFile(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    } else {
      const imageUrl = req.file.location;

      try {
        const [updatedList] = await UserList.update(
          { imageUrl: imageUrl },
          {
            where: {
              id: +listId,
            },
          }
        );
        res.status(200).json({ updatedList, imageUrl: imageUrl });
      } catch (error) {
        res.status(400).send({ error: { msg: "upload fail" } });
      }
    }
  });
};

router.use(authMiddleware);
router.get("/", getLists);
router.get("/:listId", [listIdCheck, validate, getList]);
router.post("/", [titleCheck, validate, createList]);
router.put("/:listId", [listIdCheck, titleCheck, validate, changeList]);
router.delete("/:listId", [listIdCheck, validate, deleteList]);

router.post("/:listId/upload-image", [listIdCheck, validate, uploadImage]);

module.exports = router;
