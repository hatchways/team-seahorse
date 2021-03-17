const express = require("express");
const { check, validationResult, cookie } = require("express-validator");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const UserNotificationModel = require("../models/userNotificationsModel");
const NotificationModel = require("../models/notificationModel");
const UserListModel = require("../models/userListModel");
const ListProductModel = require("../models/listProductModel");
const ProductModel = require("../models/productModel");

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
  //To enable acquiring of cookie in the client during development,
  //add NODE_ENV = development in .env
  httpOnly: process.env.NODE_ENV === "development" ? false : true,
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

//Get all notifications of a user Id
router.get("/getAllNotifications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    //Through the UserNotification Model from below, we'll be able to obtain the
    //notification_id that is only present on the particular user
    const userNotification = await UserNotificationModel.findAll({
      where: { user_id: id },
    });

    //After getting all the UserNotification Model for the user, we take that model and
    //use the notification_id inside to make our way through the products information
    const promiseArr = userNotification.map((userNotif) => {
      return NotificationModel.findOne({
        where: { id: userNotif.notification_id },
      }).then((notif) => {
        return ProductModel.findOne({ where: { id: notif.productId } }).then(
          (product) => {
            return {
              isRead: userNotif.isRead,
              id: userNotif.id,
              product,
            };
          }
        );
      });
    });

    const notifications = await Promise.all(promiseArr);

    res.send(notifications);
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
      error,
    });
  }
});

//Get all unread using user id
router.get("/getAllUnreadNotifications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userNotification = await UserNotificationModel.findAll({
      where: { user_id: id, isRead: false },
    });

    //Using an async/await would later on require me to do a search in
    //an array to find pairs, to mitigate that process, I had to use .then
    //which enabled me to use the those pairs without look ups. the pairs
    //are the userNotif and the product
    const promiseArr = userNotification.map((userNotif) => {
      return NotificationModel.findOne({
        where: { id: userNotif.notification_id },
      }).then((notif) => {
        return ProductModel.findOne({ where: { id: notif.productId } }).then(
          (product) => {
            return {
              isRead: userNotif.isRead,
              id: userNotif.id,
              product,
            };
          }
        );
      });
    });

    const result = await Promise.all(promiseArr);

    res.send(result);
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

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
router.get("/getUser/:id", async (req, res) => {
  const { id } = req.params;
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
