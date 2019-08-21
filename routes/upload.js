const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "ddi9zvjba",
  api_key: "721698235614964",
  api_secret: "t0KSuMx6aAHh0DoYew47RUSI1g0"
});

router.post("/upload", (req, res) => {
  // on log les fichiers reçus
  console.log(req.files); // { file1: ..., file2: ... }
  // ...
  const fileKeys = Object.keys(req.files);
  if (fileKeys.length === 0) {
    res.send("No file uploaded!");
    return;
  }
  fileKeys.forEach(fileKey => {
    const file = req.files[fileKey];
    cloudinary.v2.uploader.upload(file.path, (error, result) => {
      if (error) {
        return res.json({ error: `Upload Error` });
      } else {
        return res.json(result);
      }
    });
  });
});

module.exports = router;
