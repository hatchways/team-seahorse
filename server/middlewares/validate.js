const { param, body, validationResult } = require("express-validator");

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
  "productId must be a number"
).isNumeric();
const titleCheck = [
  body("title", "title must be a string").isString(),
  body("title", "title cannot be empty or longer than 32 characters.").isLength(
    {
      min: 1,
      max: 32,
    }
  ),
];
const followerIdCheck = param("userId")
  .isNumeric()
  .withMessage("userId must be a number.")
  .custom((userId, { req }) => userId != req.user.id)
  .withMessage("userId cannot be your user ID.");

//Doesn't technically belong here, but I don't know where else to put it ¯\_(ツ)_/¯
const giveServerError = (res) =>
  res.status(500).send({ errors: [{ msg: "Server error" }] });

module.exports = {
  validate,
  listIdCheck,
  productIdCheck,
  titleCheck,
  followerIdCheck,
  giveServerError,
};
