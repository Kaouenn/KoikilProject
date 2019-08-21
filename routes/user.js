const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const bodyParser = require("body-parser");
// const formidableMiddleware = require("express-formidable");

//creation des models User

// router.post("upload", formidableMiddleware(), (req, res) => {
//   console.log(req.files);
//   res.json("upload ici");
// });

const User = mongoose.model("User", {
  lastName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  adress: {
    type: String,
    required: true
  },
  postCode: {
    type: String,

    required: true,
    minlength: 2,
    maxlength: 5
  },
  salt: {
    type: String
  },
  hash: {
    type: String
  },
  token: {
    type: String
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract"
  },
  // model Userupload pour le chargement de documents contrat, livret, Piece d'identite
  userUpload: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userupload"
  }
});

// route inscription (create users)
router.post("/signupUser", async (req, res) => {
  try {
    const {
      password,
      email,
      name,
      lastName,
      postCode,
      adress,
      phoneNumber
    } = req.body;
    // on créer un token
    // uid2 est package qui permet de générer des chaines de caractere aléatoires

    const token = uid2(16);
    // on créer un salt
    const salt = uid2(16);
    // on génère le hash (SHA256 est un autre algorythme de hash)
    const hash = SHA256(password + salt).toString(encBase64);
    // on sauvegarde en bdd username, token, salt et hash mais pas password !

    const user = new User({
      email,
      token,
      salt,
      hash,
      name,
      lastName,
      postCode,
      phoneNumber,
      adress
    });
    await user.save();
    res.json({
      email,
      token
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// route login
router.post("/loginUser", async (req, res) => {
  const { password, email } = req.body;
  // on cherche l'utilisateur par son username
  const user = await User.findOne({ email });
  if (!user) {
    res.status(403).json({
      error: "Unvalid email/password"
    });
    return;
  }
  // on re-génère le hash à partir du mot de passe envoyé et du salt de l'utilisateur
  const hash = SHA256(password + user.salt).toString(encBase64);
  // si le hash correspond, le mot de passe est bon
  if (hash !== user.hash) {
    res.status(403).json({
      error: "Unvalid email/password"
    });
    return;
  }
  res.json({
    email,
    token: user.token
  });
});

// route read user
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modif du user
router.post("/updateUser", async (req, res) => {
  try {
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      (user.lastName = req.body.lastName),
        (user.name = req.body.name),
        (user.password = req.body.password),
        (user.phoneNumber = req.body.phoneNumber),
        (user.adress = req.body.adress),
        (user.postCode = req.body.postCode);

      await user.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// delete user
router.post("/deleteUser", async (req, res) => {
  try {
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      await user.remove();
      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
