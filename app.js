const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pkg = require("./package.json");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/auto-ecoles", {
  useNewUrlParser: true
});

app.get("/", (req, resp) =>
  resp.json({
    name: pkg.name,
    version: pkg.version
  })
);

//creation des models users

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

app.post("/signup", async (req, res) => {
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

// route create user
app.post("/createUser", async (req, res) => {
  try {
    const newUser = new User({
      lastName: req.body.lastName,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      adress: req.body.adress,
      postCode: req.body.postCode
    });

    await newUser.save();
    res.json({ message: "Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route read user
app.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modif du user
app.post("/updateUser", async (req, res) => {
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
app.post("/deleteUser", async (req, res) => {
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

app.listen(3000, () => {
  console.log("Server started");
});
