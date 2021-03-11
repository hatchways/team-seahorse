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

module.exports = router;
