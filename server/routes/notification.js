const authMiddleware = require("../middlewares/authMiddleware");
const ListProductModel = require("../models/listProductModel");
const NotificationModel = require("../models/notificationModel");
const ProductModel = require("../models/productModel");
const UserListModel = require("../models/userListModel");
const UserNotificationModel = require("../models/userNotificationsModel");
const router = require("express").Router();

//Make the given notification id read
router.put("/read/:id", authMiddleware, async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const { id: userId } = req.user;

    if (!notificationId) return res.status(400).send({ msg: "Must have an id parameter" });
    if (!userId) return res.status(400).send({ msg: "Must be authenticated" });

    const updatedUserNotification = await UserNotificationModel.update(
      { isRead: true },
      { where: { id: notificationId, user_id: userId } }
    );

    res.send(updatedUserNotification);
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

//Create a notification using a product id given inside the body
router.post("/createNotification", async (req, res) => {
  try {
    const { id } = req.body;

    //Create the notification model using the productId which is also is updated by a service
    const newNotif = await NotificationModel.create({
      productId: id,
    });

    //The plan here is to get the user_id who should get the notification. The said user_id can
    //be found through ListProductModel => UserListModel.obj.user_id

    //Get all ListProducts that has the same product_id
    const listProduct = await ListProductModel.findAll({
      where: { product_id: id },
    });

    //Asynchronous request for finding all the UserListModel using each list_id
    let promiseArr = listProduct.map((LP) => {
      return UserListModel.findOne({ where: { id: LP.list_id } });
    });

    const userList = await Promise.all(promiseArr);

    //Now simply create the UserNotificationModel using the user_id from the
    //UserListModel and the NotificationModel.id from the very first code.
    let userNotifPromiseArr = userList.map((list) => {
      return UserNotificationModel.create({
        user_id: list.user_id,
        notification_id: newNotif.id,
      });
    });

    const newUserNotif = await Promise.all(userNotifPromiseArr);

    res.status(201).send({
      notification: newNotif,
      userNotification: newUserNotif,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
      error,
    });
  }
});

module.exports = router;
