const db = require("../models");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  validate,
  listIdCheck,
  productIdCheck,
  giveServerError,
} = require("../middlewares/validate");
const ProductModel = require("../models/productModel");
const ListProductModel = require("../models/listProductModel");

const getProduct = async (req, res) => {
  try {
    const result = await ProductModel.findOne({
      where: { id: parseInt(req.params.productId) },
      attributes: [
        "id",
        "current_price",
        "previous_price",
        "name",
        "image_url",
        "link",
        "company",
        "is_still_available",
      ],
    });
    if (result == null) {
      res.status(400).send({ errors: [{ msg: "No product with given ID." }] });
      return;
    }
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    giveServerError(res);
  }
};

//Removes product, then checks to see if the product still exists in other lists. If it doesn't, the product is removed
//from the database.
const deleteProduct = async (req, res) => {
  let transaction = null;
  const productId = parseInt(req.params.productId);
  const listId = parseInt(req.params.listId);
  try {
    transaction = await db.transaction();
    await db.query(
      `
    DELETE FROM "ListProducts"
    USING "UserLists"
    WHERE (
        "ListProducts".list_id = "UserLists".id
        AND "ListProducts".product_id = ${productId} AND "ListProducts".list_id = ${listId}
        AND "UserLists".user_id = ${req.user.id}
    )
  `,
      { transaction }
    );
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
    transaction.commit();
    res.status(200).send();
  } catch (error) {
    console.error(error);
    giveServerError(res);
    if (transaction != null) {
      transaction.rollback();
    }
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      current_price,
      name,
      link,
      image_url,
      company,
      is_still_available,
    } = req.body;

    const newProd = await ProductModel.create({
      current_price,
      name,
      link,
      image_url,
      company,
      is_still_available,
    });

    res.send(newProd);
  } catch (error) {
    res.send(500).send({
      msg: "Server Error",
    });
  }
};

router.use(authMiddleware);
router.post("/create", createProduct);
router.get("/:productId", [productIdCheck, validate, getProduct]);
router.delete("/:listId/:productId", [
  productIdCheck,
  listIdCheck,
  validate,
  deleteProduct,
]);

module.exports = router;
