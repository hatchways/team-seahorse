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
const UserList = require("../models/userListModel");

const { scrapeAmazon } = require("../services");

const getProduct = async (req, res) => {
  try {
    const result = await ProductModel.findOne({
      where: { id: parseInt(req.params.productId) },
      attributes: [
        "id",
        "currentPrice",
        "previousPrice",
        "name",
        "imageUrl",
        "link",
        "company",
        "isStillAvailable",
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
        "ListProducts".listId = "UserLists".id
        AND "ListProducts".productId = ${productId} AND "ListProducts".listId = ${listId}
        AND "UserLists".userId = ${req.user.id}
    )
  `,
      { transaction }
    );
    const productStillExistsInOtherLists =
      (await ListProductModel.count({
        where: { productId },
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

const addProduct = async (req, res) => {
  const { url, listId } = req.body;

  try {
    const productData = await scrapeAmazon(url);
    const { title, price, imageURL } = productData;
    const [_, priceNum] = price.split("$");

    const result = await ProductModel.create({
      currentPrice: Number(priceNum),
      name: title,
      imageUrl: imageURL,
      link: url,
      company: "amazon",
      isStillAvailable: true,
    });

    await ListProductModel.create({
      listId,
      productId: result.id,
    });

    const row = await UserList.findOne({
      where: {
        id: listId,
      },
    });

    row.increment({
      items: 1,
    });

    res.status(200).send({ productData });
  } catch (error) {
    console.error(error);
  }
};

router.use(authMiddleware);
router.get("/:productId", [productIdCheck, validate, getProduct]);
router.delete("/:listId/:productId", [
  productIdCheck,
  listIdCheck,
  validate,
  deleteProduct,
]);
router.post("/", addProduct);

module.exports = router;
