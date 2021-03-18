const express = require("express");
const { validate } = require("../middlewares/validate");
const router = express.Router();
const upload = require("../services/imageUpload");
const uploadFile = upload.single("image");

const uploadImage = (req, res) => {
  uploadFile(req, res, (err) => {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    } else {
      const imageUrl = req.file.location;
      res.status(200).json({ imageUrl: imageUrl });
    }
  });
};

router.post("/", validate, uploadImage);

module.exports = router;
