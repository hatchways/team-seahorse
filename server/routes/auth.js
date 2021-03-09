const express = require("express");
const { check, validationResult, cookie } = require("express-validator");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();

const setJwt = (user) => {
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });

  return token;
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
    // if (req.cookies.token) res.redirect('req.headers.host')

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

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
    res.cookie("token", token);
    res.user = jwt.decode(token)

    // Temporary code
    res.status(201).send({
      name: newUser.name,
      email: newUser.email,
      msg: "success",
    });

    // Refactor when dashboard/home page is done.
    // res.redirect('enter_homepage_url_here')
  }
);

router.post(
  "/login",
  [
    check("email", "Must be an Email").isEmail(),
    check("password", "Must not be empty").notEmpty(),
  ],
  async (req, res) => {
    // if (req.cookies.token) res.redirect(req.headers.host)

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors,
      });
    }

    const { email, password } = req.body;

    //find email
    const exisitingUser = await UserModel.findOne({ where: { email } });

    if (!exisitingUser)
      return res.status(400).send({
        //update to error obj, having code and message
        msg: "User does not exist",
        errorCode: "400",
      });

    // check given password
    if (!exisitingUser.isPasswordCorrect(password)) {
      res.status(403).send({
        msg: "Incorrect Password",
      });
    }

    const token = setJwt(exisitingUser);

    // Set token to cookie
    res.cookie("token", token);
    res.user = jwt.decode(token)

    //Temporary code
    res.send({
      name: exisitingUser.name,
      email: exisitingUser.email,
      msg: "success",
    });

    // Refactor when dashboard/home page is done.
    // res.redirect('enter_homepage_url_here')
  }
);

module.exports = router;
