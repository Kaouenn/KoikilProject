const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const pkg = require("./package.json");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");

//Importez Cloudinary et spécifiez vos identifiants (credentials) dans votre backend.
/* const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "ddi9zvjba",
  api_key: "721698235614964",
  api_secret: "t0KSuMx6aAHh0DoYew47RUSI1g0"
}); */

app.use(cors());
app.use(formidableMiddleware());

app.use(bodyParser.json());

/////////////////////////////////////////////////////////////// Se connecter à la base de données
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/KoikilDatabase",
  {
    useNewUrlParser: true
  }
);

/////////////////////////////////////////////////////////////// Inititialisation des classes

/////////////////////////////////////////////////////////////// Inititialisation des classes

const Autoecole = mongoose.model("Autoecole", {
  Dept: Number,
  "Raison sociale": String,
  "N° agrément": String,
  Adresse: String,
  CP: String,
  Ville: String
});

////////////////Début des routes

///////requete type "create"
app.post("/autoecole/create", async (req, res) => {
  for (let i = 0; i < tab.length; i++) {
    try {
      if (tab[i].CP === null) {
      } else if (tab[i].CP < 10000) {
        const newAutoecole = new Autoecole({
          Dept: tab[i].Dept,
          "Raison sociale": tab[i]["Raison sociale"],
          "N° agrément": tab[i]["N° agrément"],
          Adresse: tab[i].Adresse,
          CP: "0" + tab[i].CP,
          Ville: tab[i].Ville
        });
        await newAutoecole.save();
      } else {
        const newAutoecole = new Autoecole({
          Dept: tab[i].Dept,
          "Raison sociale": tab[i]["Raison sociale"],
          "N° agrément": tab[i]["N° agrément"],
          Adresse: tab[i].Adresse,
          CP: tab[i].CP,
          Ville: tab[i].Ville
        });
        await newAutoecole.save();
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  res.json({ message: "All Auto Ecole Created" });
});

///route READ Get des auto-ecoles
app.get("/autoecole", async (req, res) => {
  try {
    const autoecole = await Autoecole.find();
    res.json(autoecole);
  } catch (error) {
    return res.status(400).json({
      error: {
        message: "An error occured"
      }
    });
  }
});

/////////////////////////////////////////////////////////////// Fin des routes

app.get("/", (req, resp) =>
  resp.json({
    name: pkg.name,
    version: pkg.version
  })
);

//creation des models User

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
app.post("/signupUser", async (req, res) => {
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
    // on sauvegarde en bdd email, token, salt et hash mais pas password !
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
app.post("/loginUser", async (req, res) => {
  const { password, email } = req.body;
  // on cherche l'utilisateur par son email
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

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
