const express = require("express");
const { check, validationResult, cookie } = require("express-validator");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const UserNotificationModel = require("../models/userNotificationsModel");
const NotificationModel = require("../models/notificationModel");

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

//Register
router.post(
  "/register",
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
      user: {
        name: newUser.name,
        email: newUser.email,
        id: newUser.id,
      },
    });
  }
);

//Login
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
      user: {
        name: existingUser.name,
        email: existingUser.email,
        id: existingUser.id,
      },
    });
  }
);

//Get all notifications of a user Id
router.get("/getAll/:id", async (req, res) => {
  try {
    const { id } = req.params;

    //Through the UserNotification Model from below, we'll be able to obtain the
    //notification_id that is only present on the particular user
    const userNotification = await UserNotificationModel.findAll({
      where: { user_id: id },
    });

    const promiseArr = [];

    //Get all the notifications for each of the values in the array
    userNotification.forEach((userNotif) => {
      promiseArr.push(
        NotificationModel.findOne({ where: { id: userNotif.notification_id } })
      );
    });

    const data = await Promise.all(promiseArr);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

//Get all unread using user id
router.get("/getAllUnread/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userNotification = await UserNotificationModel.findAll({
      where: { user_id: id },
    });

    let promiseArr = [];

    userNotification.forEach((element) => {
      promiseArr.push(
        NotificationModel.findOne({
          where: { id: element.notification_id, isRead: false },
        })
      );
    });

    let data = await Promise.all(promiseArr);

    data = data[0] === null ? [] : data;

    console.log(data);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

//Get current user who's logged in
router.get("/getCurrentUser", authenticate, (req, res) => {
  res.send({
    user: req.user,
  });
});

module.exports = router;
