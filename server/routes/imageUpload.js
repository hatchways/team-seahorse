const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = require("../services/imageUpload");
const uploadFile = upload.single("image");

const uploadImage = (req, res) => {
  uploadFile(req, res, (err) => {
    if (err) {
      return res.status(500).json({
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

router.use(authMiddleware);
router.post("/", uploadImage);

module.exports = router;
