const express = require("express");
const { check, validationResult, cookie } = require("express-validator");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");

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
  maxAge: 1209600,
};

//Sign Up User
router.post(
  "/signup",
  [
    check("name", "Name must not be empty").notEmpty(),
    check("password", "Must be at least 6 characters long").isLength({
      min: 6,
    }),
    check("email", "Must be an Email").isEmail(),
  ],
  async (req, res) => {
    validate(req, res);

    const { name, email, password } = req.body;

    //Check if email is used
    const existingUser = await UserModel.findOne({ where: { email } });

    if (existingUser)
      return res
        .status(400)
        .send({ error: { msg: "User already exist", code: "400" } });

    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    const token = setJwt(newUser);

    //Set token to Cookie
    res.cookie("token", token, tokenOptions);

    res.status(201).send({
      user: {
        name: newUser.name,
        email: newUser.email,
        id: newUser.id,
      },
    });
  }
);

//Sign In User
router.post(
  "/signin",
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
      user: {
        name: existingUser.name,
        email: existingUser.email,
        id: existingUser.id,
      },
    });
  }
);

//Log out User
router.get("/signout", (req, res) => {
  res.clearCookie("token");

  res.send({
    msg: "Successful Log out",
  });
});

//Get currently logged in user obj
router.get("/currentUser", authenticate, (req, res) => {
  res.send({
    user: req.user,
  });
});

//Get user by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
console.log(req.params)
  try {
    const user = await UserModel.findOne({ where: { id } });

    if (!user) {
      return res.status(400).send({
        msg: "User does not exist",
        errorCode: "400",
      });
    }

    res.send({
      user,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

module.exports = router;
