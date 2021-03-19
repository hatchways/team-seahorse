const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  followerIdCheck,
  validate,
  giveServerError,
} = require("../middlewares/validate");
const { UserModel, UserFollowerModel } = require("../models/models");
const db = require("../models");

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
    const followedUsers = await UserModel.findAll({
      where: {
        "$FollowedUser.id$": req.user.id,
      },
      include: {
        association: "FollowedUser",
      },
      attributes: ["id", "name"],
    });
    res.status(200).send(followedUsers);
  } catch (error) {
    console.error(error);
    giveServerError(res);
  }
};

const followUser = async (req, res) => {
  try {
    await UserFollowerModel.create({
      followerId: req.user.id,
      followedId: req.params.userId,
    });
    res.status(201).send();
  } catch (error) {
    console.error(error);
    //If the user already follows the user they are trying to follow.
    if (
      error.errors[0].type == "unique violation" &&
      error.errors[0].path == "followerId"
    ) {
      res
        .status(400)
        .send({ errors: [{ msg: "Already following this user." }] });
    }
    giveServerError(res);
  }
};

router.use(authMiddleware);
router.get("/suggestions", getSuggestions);
router.get("/following", getFollowedUsers);
router.post("/follow/:userId", [followerIdCheck, validate, followUser]);

module.exports = router;
