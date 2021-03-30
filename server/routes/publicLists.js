const express = require("express");
const router = express.Router();
const UserListModel = require("../models/userListModel");

const getLists = async (req, res) => {
  try {
    const results = await UserListModel.findAll({
      attributes: ["id", "title", "items", "imageUrl", "isPrivate"],
      where: { isPrivate: false },
      order: ["id"],
    });
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
  }
};

router.get("/", getLists);

module.exports = router;
