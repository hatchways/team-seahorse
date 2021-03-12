const db = require("../models");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ProductModel = require("../models/productModel");

router.use(authMiddleware);

router.get("/:productId", async (req, res) => {
  try {
    const result = await ProductModel.find({
      where: { id: req.params.productId },
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
  } catch {
    res.status(500).send();
  }
});

router.delete("/:listId/:productId", async (req, res) => {
  const transaction = await db.transaction();
  await db.query(
    `
    DELETE FROM "ListProducts"
    USING "UserLists"
    WHERE (
        "ListProducts".list_id = "UserLists".id
        AND "ListProducts".product_id = ${req.params.productId} AND "ListProducts".list_id = ${req.params.listId}
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
});

module.exports = router;
