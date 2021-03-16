const { param, body, oneOf, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors);
  }
  next();
};

const listIdCheck = param("listId", "listId must be a number.").isNumeric();
const productIdCheck = param(
  "productId",
  "productId must be a number."
).isNumeric();
const titleCheck = body("title")
  .isString()
  .withMessage("title must be a string.")
  .isLength({
    min: 1,
    max: 32,
  })
  .withMessage("title cannot be empty or longer than 32 characters.");
const coverImageUrlCheck = body("coverImageUrl")
  .isURL()
  .withMessage("coverImageUrl must be a URL.");
const titleOrCoverImageUrlCheck = oneOf(
  [titleCheck, coverImageUrlCheck],
  "either title or coverImageUrl must be present."
);

module.exports = {
  validate,
  listIdCheck,
  productIdCheck,
  titleCheck,
  coverImageUrlCheck,
  titleOrCoverImageUrlCheck,
};
