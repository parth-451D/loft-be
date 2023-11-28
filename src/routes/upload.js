const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_BUCKET_ACCESS_KEY,
  secretAccessKey: process.env.S3_BUCKET_ACCESS_KEY_SECRET,
  region: process.env.S3_BUCKET_REGION,
});

// Route to handle file upload
router.post("/uploadImage", upload.single("image"), (req, res) => {
  const file = req.file;

  // Read the file content
  fs.readFile(file.path, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to read file");
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.originalname,
      Body: data,
    };

    // Upload the file to S3
    s3.upload(params, (uploadErr, uploadData) => {
      if (uploadErr) {
        console.error(uploadErr);
        return res.status(500).send("Failed to upload image");
      }
      
      res.status(200).json({ imageUrl: uploadData.Location });
    });
  });
});

module.exports = router;