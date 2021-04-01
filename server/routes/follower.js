const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  followerIdCheck,
  validate,
  giveServerError,
} = require("../middlewares/validate");
const {
  UserModel,
  UserFollowerModel,
  NotificationModel,
} = require("../models/models");
const db = require("../models");
const { FOLLOWED } = require("../utils/enums");
const userSockets = require("../sockets/userSockets");

//Gets all the users the user is currently following, and from that gets all the users that aren't part of that group.
const getSuggestions = async (req, res) => {
  let transaction = null;
  try {
    transaction = await db.transaction();
    const followedUsers = await UserModel.findAll({
      where: {
        "$FollowedUser.id$": req.user.id,
      },
      include: {
        association: "FollowedUser",
      },
      attributes: ["id"],
      transaction,
    });
    const strangers = await UserModel.findAll({
      where: {
        id: {
          [Op.notIn]: followedUsers.map((user) => user.id).concat(req.user.id),
        },
      },
      attributes: ["id", "name"],
      transaction,
    });
    await transaction.commit();
    res.status(200).send(strangers);
  } catch (error) {
    console.error(error);
    giveServerError(res);
    if (transaction != null) await transaction.rollback();
  }
};

const getFollowedUsers = async (req, res) => {
  try {
    const followedUsers = (
      await UserModel.findAll({
        where: {
          "$FollowedUser.id$": req.user.id,
        },
        include: {
          association: "FollowedUser",
        },
        attributes: ["id", "name"],
      })
    ).map((user) => {
      //removes FollowerUser property
      const { id, name } = user;
      return { id, name };
    });
    res.status(200).send(followedUsers);
  } catch (error) {
    console.error(error);
    giveServerError(res);
  }
};

const followUser = async (req, res) => {
  const transaction = await db.transaction();

  try {
    await UserFollowerModel.create(
      {
        followerId: req.user.id,
        followedId: req.params.userId,
      },
      { transaction }
    );

    let data = {
      followerId: req.user.id,
      followedId: req.params.userId,
      //change in the future
      followerImageUrl: "https://www.w3schools.com/howto/img_avatar2.png",
      followerName: req.body.user.name,
    };

    //create followed notification for that user
    await NotificationModel.create(
      {
        type: FOLLOWED,
        data,
        userId: req.params.userId,
        isRead: false,
      },
      { transaction }
    );

    //If the followed user is connected, emit an event to show a notification for them
    if (userSockets.connections[`${req.params.userId}`]) {
      userSockets.connections[`${req.params.userId}`].forEach((socket) => {
        socket.emit("new-notifications");
      });
    }

    await transaction.commit();

    res.status(201).send();
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    //If the user already follows the user they are trying to follow.
    if (
      error.errors[0].type == "unique violation" &&
      error.errors[0].path == "followerId"
    ) {
      res
        .status(400)
        .send({ errors: [{ msg: "Was already following this user." }] });
    }
    giveServerError(res);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const wasFollowing =
      (await UserFollowerModel.destroy({
        where: {
          followerId: req.user.id,
          followedId: req.params.userId,
        },
      })) == 1;
    if (!wasFollowing) {
      res.status(400).send({
        errors: [{ msg: "Wasn't already following this user." }],
      });
      return;
    }
    res.status(201).send();
  } catch (error) {
    console.error(error);
    giveServerError(error);
  }
};

router.use(authMiddleware);
router.get("/suggestions", getSuggestions);
router.get("/following", getFollowedUsers);
router.post("/follow/:userId", [followerIdCheck, validate, followUser]);
router.post("/unfollow/:userId", [followerIdCheck, validate, unfollowUser]);

module.exports = router;
