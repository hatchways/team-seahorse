const authMiddleware = require("../middlewares/authMiddleware");
const ListProductModel = require("../models/listProductModel");
const NotificationModel = require("../models/notificationModel");
const ProductModel = require("../models/productModel");
const UserListModel = require("../models/userListModel");
const { PRICE } = require("../utils/enums");
const router = require("express").Router();

//Make the given notification id read
router.put("/read/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: user_id } = req.user;

    await NotificationModel.update(
      { isRead: true },
      {
        where: {
          id,
          user_id,
        },
      }
    );

    //update returns only a 1 or a 0 so we create another query to show the client
    const newNotification = await NotificationModel.findOne({
      where: {
        id,
        user_id,
      },
    });

    res.send(newNotification);
  } catch (error) {
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

//Create a notification using a product id given inside the body
//Will be used by a service
router.post("/price", async (req, res) => {
  const { productId, title, price, previousPrice } = req.body;

  const promiseArr = [];

  //Find all lists containing this product
  const listProds = await ListProductModel.findAll({
    where: {
      product_id: productId,
    },
  });

  //This is the container where the NotificationModel.data is held. The number of notifs
  //inside the hashmap is equal to number of users who has the particular product in their
  //list regardless of how many list it is in.
  //We use a hashmap to provide better look up times since we'll have to update data as we go
  let newNotifs = {};

  //Here we run a foreach to find each of the lists owner through UserList Model.
  listProds.forEach((listProd) => {
    promiseArr.push(
      UserListModel.findOne({
        where: {
          id: listProd.list_id,
        },
      })
    );
  });

  //This is an array of all owners of each of those list. Non duplicating lists but with a
  //possibility of users owning more than one of those list.
  const userLists = await Promise.all(promiseArr);

  //For each of the over all users in the userLists, we build the data object which will be
  //placed inside the NotificationModel and its other attributes. This iterates for each of the userLists, but conditionals
  //are placed to only make one per user. If the model a schema has already been made for a user, we instead
  //make an update to the objects data.listLocations
  userLists.forEach((userList) => {
    //If we havent made a data object for the user, make one.
    if (!newNotifs[`${userList.user_id}`]) {
      const data = {
        title,
        productId,
        price,
        previousPrice,
        listLocations: [userList.id],
      };

      newNotifs[`${userList.user_id}`] = {
        type: "price",
        data,
        user_id: userList.user_id,
        isRead: false,
      };

      //The data object has an array listLocations. This is basically the lists of a user where the
      //particular product is placed. If a data object is already made, we simply add in the current list
      //to the listLocations array.
    } else {
      newNotifs[`${userList.user_id}`].data.listLocations.push(userList.id);
    }
  });

  //This would convert the newNotifs object into an array.
  //[ [dataObject], [dataObject], ... ]
  //Inside the data object, the [0] index is the key, while the [0] index is the data object itself.
  const parsedNotifs = Object.entries(newNotifs);

  const notifPromiseArr = [];

  //This iteration is the main part of creating the notification
  parsedNotifs.forEach((notif) => {
    notifPromiseArr.push(NotificationModel.create(notif[1]));
  });

  //This is the array of all the new notifications made for a user.
  //May be changed in the future to just [1] for success since no one need to know
  const allNewNotifs = await Promise.all(notifPromiseArr);

  //Update Product model to its new price
  await ProductModel.update(
    { current_price: price },
    {
      where: {
        id: productId,
      },
    }
  );

  res.status(201).send(allNewNotifs);
});

//Find specifically ALL notifications of a user about a price change
//Accepts "order" as a query. Be default is "DESC" to show latest notifs first
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
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

//Find specifically ALL UNREAD notifications of a user about a price change
//Accepts "order" as a query. Be default is "DESC" to show latest notifs first
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
    res.status(500).send({
      msg: "Server Error",
    });
  }
});

module.exports = router;
