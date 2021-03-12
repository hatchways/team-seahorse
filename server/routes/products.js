const db = require("../models");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ProductModel = require("../models/productModel");
const ListProductModel = require("../models/listProductModel");

router.use(authMiddleware);

router.get("/:productId", async (req, res) => {
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
    res.status(200).send(JSON.stringify(result));
  } catch (error) {
    res.status(500).send();
  }
});

//Removes product, then checks to see if the product still exists in other lists. If it doesn't, the product is removed
//from the database.
router.delete("/:listId/:productId", async (req, res) => {
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
    res.status(500).send();
    if (transaction != null) {
      transaction.rollback();
    }
  }
});

module.exports = router;
