const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");

aws.config.update({ region: "us-east-1" });

const s3 = new aws.S3({
  apiVersion: "2012-10-17",
  Buckets: "seahorse-image",
});

//testing s3 connection
s3.listBuckets((err, data) => {
  if (err) console.log("error", err);
  else console.log("Success", data.Buckets);
});

const checkFileType = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG is allowed!", false));
  }
};

const upload = multer({
  checkFileType,
  storage: multerS3({
    s3,
    bucket: "seahorse-image",
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
