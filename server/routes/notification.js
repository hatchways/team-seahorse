const authMiddleware = require("../middlewares/authMiddleware");
const ListProductModel = require("../models/listProductModel");
const NotificationModel = require("../models/notificationModel");
const { sequelize } = require("../models/productModel");
const ProductModel = require("../models/productModel");
const UserListModel = require("../models/userListModel");
const { PRICE } = require("../utils/enums");
const router = require("express").Router();

//Make the given notification id read
router.put("/read/:id", authMiddleware, async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const { id: userId } = req.user;

    const notification = await NotificationModel.findOne({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

    if (!notification)
      return res.status(400).send({
        error: {
          msg: "Notification not found.",
        },
      });

    notification.isRead = true;

    const updatedNotification = await notification.save();

    res.send(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Server Error",
      data: error,
    });
  }
});

//Paginated querying of notifications of a user
//Accepts "page" as a query. By default will be a 1.
//Accepts "order" as a query. By default is "DESC" to show latest notifs first
router.get("/get-notifications", authMiddleware, async (req, res) => {
  const { id: userId } = req.user;
  let { order, page, maxNotifications } = req.query;

  if (!page) page = 1;
  if (!maxNotifications) maxNotifications = 10;

  if (!order) order = "DESC";
  else order = order.toUpperCase();

  if (order !== "ASC" && order !== "DESC") {
    return res
      .status(400)
      .send({ error: { msg: "Invalid order query", errorCode: 400 } });
  }

  try {
    const userNotifications = await NotificationModel.findAll({
      where: {
        user_id: userId,
      },
      order: [["createdAt", order]],
      limit: maxNotifications,
      offset: (page - 1) * maxNotifications,
    });

    res.send(userNotifications);
  } catch (error) {
    console.error(error);
    res.send({
      msg: "Server Error",
      data: error,
    });
  }
});

//Create a notification using a product id given inside the body
//Will be used by a service
router.post("/price", async (req, res) => {
  const transaction = await sequelize.transaction();
  const { productId, title, price } = req.body;

  try {
    //Get the product with the price change
    const productModel = await ProductModel.findOne({
      where: {
        id: productId,
      },
      transaction,
    });

    //Find all lists containing this product
    const listProds = await ListProductModel.findAll({
      where: {
        product_id: productId,
      },
      transaction,
    });

    //This is the container where the NotificationModel.data is held. The number of notifs
    //inside the hashmap is equal to number of users who has the particular product in their
    //list regardless of how many list it is in.
    //We use a hashmap to provide better look up times since we'll have to update data as we go
    let newNotifications = {};

    //This is an array of all owners of each of those list. Non duplicating lists but with a
    //possibility of users owning more than one of those list.
    const userLists = await UserListModel.findAll({
      where: {
        id: listProds.map((listProd) => {
          return listProd.list_id;
        }),
      },
      transaction,
    });

    //For each of the over all users in the userLists, we build the data object which will be
    //placed inside the NotificationModel and its other attributes. This iterates for each of the userLists, but conditionals
    //are placed to only make one per user. If the model a schema has already been made for a user, we instead
    //make an update to the objects data.listLocations
    userLists.forEach((userList) => {
      //If we havent made a data object for the user, make one.
      if (!newNotifications[userList.user_id]) {
        const data = {
          title,
          productId,
          price,
          previousPrice: productModel.current_price,
          listLocations: [userList.id],
        };

        newNotifications[userList.user_id] = {
          type: "price",
          data,
          user_id: userList.user_id,
          isRead: false,
        };

        //The data object has an array listLocations. This is basically the lists of a user where the
        //particular product is placed. If a data object is already made, we simply add in the current list
        //to the listLocations array.
      } else {
        newNotifications[userList.user_id].data.listLocations.push(userList.id);
      }
    });

    //This would convert the newNotifications object into an array.
    //[ [dataObject], [dataObject], ... ]
    const parsedNotifications = Object.values(newNotifications);

    //This is the array of all the new notifications made for a user.
    await NotificationModel.bulkCreate(parsedNotifications);

    //Update Product Model
    await ProductModel.update(
      {
        current_price: price,
        previous_price: productModel.current_price,
      },
      {
        where: {
          id: productId,
        },
        transaction,
      }
    );

    await transaction.commit();

    res.status(201).send({ msg: "Success" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.send({
      error: {
        msg: "Server Error while using service",
        data: error,
      },
    });
  }
});

//Find specifically ALL notifications of a user about a price change
//Accepts "order" as a query. By default is "DESC" to show latest notifs first
router.get("/price/all", authMiddleware, async (req, res) => {
  const { id } = req.user;
  let { order } = req.query;

  if (!order) order = "DESC";
  else order = order.toUpperCase();

  if (order !== "ASC" && order !== "DESC") {
    return res
      .status(400)
      .send({ error: { msg: "Invalid order query", errorCode: 400 } });
  }

  try {
    const result = await NotificationModel.findAll({
      where: {
        type: PRICE,
        user_id: id,
      },
      order: [["createdAt", order]],
    });

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Server Error",
      data: error,
    });
  }
});

//Find specifically ALL UNREAD notifications of a user about a price change
//Accepts "order" as a query. By default is "DESC" to show latest notifs first
router.get("/price/unread", authMiddleware, async (req, res) => {
  const { id } = req.user;
  let { order } = req.query;

  if (!order) order = "DESC";
  else order = order.toUpperCase();

  if (order !== "ASC" && order !== "DESC") {
    return res
      .status(400)
      .send({ error: { msg: "Invalid order query", errorCode: 400 } });
  }

  try {
    const result = await NotificationModel.findAll({
      where: {
        type: PRICE,
        user_id: id,
        isRead: false,
      },
      order: [["createdAt", order]],
    });

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Server Error",
      data: error,
    });
  }
});

module.exports = router;
