const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "ddi9zvjba",
  api_key: "721698235614964",
  api_secret: "t0KSuMx6aAHh0DoYew47RUSI1g0"
});

router.post("/upload", (req, res) => {
  // les différentes clés des fichiers (file1, file2, file3...)
  const files = Object.keys(req.files);
  if (files.length) {
    const results = {};
    // on parcourt les fichiers
    files.forEach(fileKey => {
      // on utilise les path de chaque fichier (la localisation temporaire du fichier sur le serveur)
      cloudinary.v2.uploader.upload(
        req.files[fileKey].path,
        {
          // on peut préciser un dossier dans lequel stocker l'image
          folder: "some_folder"
        },
        (error, result) => {
          // on enregistre le résultat dans un objet
          if (error) {
            results[fileKey] = {
              success: false,
              error: error
            };
          } else {
            results[fileKey] = {
              success: true,
              result: result
            };
          }
          if (Object.keys(results).length === files.length) {
            // tous les uploads sont terminés, on peut donc envoyer la réponse au client
            return res.json(results);
          }
        }
      );
    });
  } else {
    res.send("No file uploaded!");
  }
});

module.exports = router;
