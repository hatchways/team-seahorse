const authMiddleware = require("../middlewares/authMiddleware");
const ListProductModel = require("../models/listProductModel");
const NotificationModel = require("../models/notificationModel");
const UserListModel = require("../models/userListModel");
const { PRICE } = require("../utils/enums");
const router = require("express").Router();

//Make the given notification id read
router.put("/read/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    await NotificationModel.update(
      { isRead: true },
      {
        where: {
          id,
          userId,
        },
      }
    );

    //update returns only a 1 or a 0 so we create another query to show the client
    const newNotification = await NotificationModel.findOne({
      where: {
        id,
        userId,
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

  //Find all lists associated with this product
  const listProds = await ListProductModel.findAll({ where: { productId } });

  let newNotifs = {};

  //Find the owners associated with the list
  listProds.forEach((listProd) => {
    promiseArr.push(
      UserListModel.findOne({
        where: {
          id: listProd.listId,
        },
      })
    );
  });

  const userLists = await Promise.all(promiseArr);

  userLists.forEach((userList) => {
    if (!newNotifs[`${userList.userId}`]) {
      const data = {
        title,
        productId,
        price,
        previousPrice,
        listLocations: [userList.id],
      };

      newNotifs[`${userList.userId}`] = {
        type: "price",
        data,
        userId: userList.userId,
        isRead: false,
      };
    } else {
      newNotifs[`${userList.userId}`].data.listLocations.push(userList.id);
    }
  });

  const parsedNotifs = Object.entries(newNotifs);

  const promisedArr2 = [];

  parsedNotifs.forEach((notif) => {
    promisedArr2.push(NotificationModel.create(notif[1]));
  });

  const allNewNotifs = await Promise.all(promisedArr2);
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
        userId: id,
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
        userId: id,
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
