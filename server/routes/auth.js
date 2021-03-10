const express = require("express");
const { check, validationResult, cookie } = require("express-validator");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();

const setJwt = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });

  return token;
};

const validate = (_req, _res) => {
  const errors = validationResult(_req);

  if (!errors.isEmpty()) {
    return _res.status(400).send(errors);
  }
};

const tokenOptions = {
  httpOnly: true,
  //14 days
  maxAge: 1209600
};

router.post(
  "/register",
  [
    check("name", "Name must not be empty").notEmpty(),
    check("password", "Must be at least 6 characters long").isLength({
      min: 6,
    }),
    check("email", "Must be an Email").isEmail().notEmpty(),
  ],
  async (req, res) => {
    validate(req, res);

    const { name, email, password } = req.body;

    //Check if email is used
    const exisitingUser = await UserModel.findOne({ where: { email } });

    if (exisitingUser)
      return res
        .status(400)
        .send({ error: { message: "User already exist", code: "400" } });

    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    const token = setJwt(newUser);

    //Set token to Cookie
    res.cookie("token", token, tokenOptions);

    res.status(201).send({
      name: newUser.name,
      email: newUser.email
    });
  }
);

router.post(
  "/login",
  [
    check("email", "Must be an Email").isEmail(),
    check("password", "Must not be empty").notEmpty(),
  ],
  async (req, res) => {
    validate(req, res);

    const { email, password } = req.body;

    //find email
    const existingUser = await UserModel.findOne({ where: { email } });

    if (!existingUser)
      return res.status(400).send({
        msg: "User does not exist",
        errorCode: "400",
      });

    // check given password
    if (!existingUser.isPasswordCorrect(password)) {
      res.status(400).send({
        msg: "Invalid Credential",
      });
    }

    const token = setJwt(existingUser);

    // Set token to cookie
    res.cookie("token", token, tokenOptions);

    res.send({
      name: existingUser.name,
      email: existingUser.email,
    });
  }
);

module.exports = router;
