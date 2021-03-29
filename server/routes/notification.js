const authMiddleware = require("../middlewares/authMiddleware");
const ListProductModel = require("../models/listProductModel");
const NotificationModel = require("../models/notificationModel");
const { sequelize } = require("../models/productModel");
const ProductModel = require("../models/productModel");
const UserListModel = require("../models/userListModel");
const { ALL_TYPES_OBJECT } = require("../utils/enums");
const router = require("express").Router();

//Make the given notification id read
router.put("/read/:id", authMiddleware, async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const { id: userId } = req.user;

    const notification = await NotificationModel.findOne({
      where: {
        id: notificationId,
        userId: userId,
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
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: {
        msg: "Server Error",
        data: err,
      },
    });
  }
});

router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;

    const result = await NotificationModel.update(
      { isRead: true },
      {
        where: {
          userId: id,
          isRead: false,
        },
        returning: true,
      }
    );

    res.send({ result });
  } catch (err) {
    console.error(err);
    res.send({
      error: {
        msg: "Server Error ",
        data: err,
      },
    });
  }
});

//Paginated querying of notifications of a user
//Accepts "page" as a query. By default will be a 1.
//Accepts "order" as a query. By default is "DESC" to show latest notifs first
//Accepts "type" as a query. By default is an array of all types to show all types of notifications
//Accepts "isRead" as a query. By default is [true, false] all regardles if read or not
//Accepts "maxNotifications" as a query. By default is 10
router.get("/get-notifications", authMiddleware, async (req, res) => {
  const { id: userId } = req.user;
  let { order, page, maxNotifications, type, isRead } = req.query;

  const validQueries = validateQueryParams(
    page,
    order,
    type,
    isRead,
    maxNotifications
  );

  if (validQueries === false) {
    return res.status(400).send({
      error: {
        msg: "Invalid query paramter value detected",
      },
    });
  } else {
    isRead = validQueries.isRead;
    order = validQueries.order;
    page = validQueries.page;
    maxNotifications = validQueries.maxNotifications;
    type = validQueries.type;
  }

  try {
    const userNotifications = await NotificationModel.findAll({
      where: {
        userId,
        type,
        isRead,
      },
      order: [["createdAt", order]],
      limit: maxNotifications,
      offset: (page - 1) * maxNotifications,
    });

    res.send(userNotifications);
  } catch (err) {
    console.error(err);
    res.send({
      error: {
        msg: "Server Error",
        data: err,
      },
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
        productId,
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
          return listProd.listId;
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
      if (!newNotifications[userList.userId]) {
        const data = {
          title,
          productId,
          price,
          previousPrice: productModel.currentPrice,
          listLocations: [userList.id],
          imageUrl: productModel.imageUrl,
        };

        newNotifications[userList.userId] = {
          type: "price",
          data,
          userId: userList.userId,
          isRead: false,
        };

        //The data object has an array listLocations. This is basically the lists of a user where the
        //particular product is placed. If a data object is already made, we simply add in the current list
        //to the listLocations array.
      } else {
        newNotifications[userList.userId].data.listLocations.push(userList.id);
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
        currentPrice: price,
        previousPrice: productModel.currentPrice,
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

router.get("/get-count", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;

    const notificationCount = await NotificationModel.count({
      where: {
        isRead: false,
        userId: id,
      },
    });

    res.send({ length: notificationCount });
  } catch (err) {
    console.error(err);
    res.send({
      error: {
        msg: "Server Error while using service",
        data: err,
      },
    });
  }
});

const validateQueryParams = (page, order, type, isRead, maxNotifications) => {
  const typesArray = Object.values(ALL_TYPES_OBJECT);

  if (!type) {
    type = typesArray;
  } else {
    type = type.toLowerCase();
    if (!ALL_TYPES_OBJECT[type.toUpperCase()]) {
      return false;
    }
  }

  if (!page) {
    page = 1;
  } else {
    if (isNaN(page)) {
      return false;
    }
  }

  if (!maxNotifications) {
    maxNotifications = 10;
  } else {
    if (isNaN(maxNotifications)) {
      return false;
    }
  }

  if (!order) order = "DESC";
  else order = order.toUpperCase();

  if (order !== "ASC" && order !== "DESC") {
    return false;
  }

  if (isRead === "true") {
    isRead = true;
  } else if (isRead === "false") isRead = false;
  else if (isRead) return false;

  isRead = [true, false];

  return { page, order, type, isRead, maxNotifications };
};

module.exports = router;
