const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const nodemailer = require("nodemailer");

const User = require("../models/usermodel");

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
    } = req.fields;
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

    const mail = await User.findOne({ email });
    if (!mail) {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "koikilBackOffice@gmail.com", // generated ethereal user
          pass: "Koikil2019@" // generated ethereal password
        }
      });

      await transporter.sendMail({
        from: '"Lucas Koikil" <koikilBackOffice@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Hello " + user.name, // Subject line
        text: "Votre inscription sur Koikil", // plain text body
        html: "<b>Hello world?</b>" // html body
      });
    }

    await user.save();
    res.json({
      email,
      token,
      name,
      lastName
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// route login
router.post("/loginUser", async (req, res) => {
  const { password, email } = req.fields;

  // on cherche l'utilisateur par son username
  const user = await User.findOne({ email }).populate("autoEcole");
  console.log("user pop  ", user);

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
  if (user.autoEcole) {
    res.json({
      email,
      token: user.token,
      name: user.name,
      lastName: user.lastName,
      autoEcole: user.autoEcole["Raison Sociale"],
      paymentCheck: user.paymentCheck,
      dateCreatedContract: user.dateCreatedContract
    });
  }

  res.json({
    email,
    token: user.token,
    name: user.name,
    lastName: user.lastName,
    paymentCheck: user.paymentCheck,
    dateCreatedContract: user.dateCreatedContract
  });
});

// route read user
router.get("/user", async (req, res) => {
  try {
    const users = await User.find().populate("autoEcole");
    //console.log(users);

    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/updateUserAutoEcole", async (req, res) => {
  try {
    const { email } = req.fields;
    const user = await User.findOne({ email }).populate("autoEcole");
    console.log(user);

    if (user.autoEcole) {
      res.json({
        email,
        token: user.token,
        name: user.name,
        lastName: user.lastName,
        autoEcole: user.autoEcole["Raison Sociale"],
        paymentCheck: user.paymentCheck,
        dateCreatedContract: user.dateCreatedContract
      });
    }
    res.json({
      email,
      token: user.token,
      name: user.name,
      lastName: user.lastName,
      paymentCheck: user.paymentCheck,
      dateCreatedContract: user.dateCreatedContract
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modif du user
router.post("/updateUser", async (req, res) => {
  try {
    if (req.fields.email) {
      const user = await User.findOne({
        email: req.fields.email
      });

      /* -------------------------------------------------------------------------
      const autoecole = await Autoecole.findOne({
      _id: req.fields.autoecole
      });
      (user.lastName = req.fields.lastName),
        (user.name = req.fields.name),
        (user.password = req.fields.password),
        (user.phoneNumber = req.fields.phoneNumber),
        (user.adress = req.fields.adress),
        (user.postCode = req.fields.postCode),
        (user.autoEcole = autoecole);
        ---------------------------------------------------------------------------- */

      //boucle sur req.fields(drivingschool) qui correspond au keys des models
      //Object.keys pour recupéré les clés de req.fields(drivingschool)
      const drivingschool = await Object.keys(req.fields);
      for (let i = 0; i < drivingschool.length; i++) {
        // maintenant element correspond à chaque clés
        const element = drivingschool[i];
        //
        user[element] = req.fields[element];
      }

      await user.save();
      res.json({ user });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/resetPasswordUser", async (req, res) => {
  try {
    const { password, token } = req.fields;
    // on créer un salt
    const salt = uid2(16);
    // on génère le hash (SHA256 est un autre algorythme de hash)
    const hash = SHA256(password + salt).toString(encBase64);
    // on sauvegarde en bdd username, token, salt et hash mais pas password !
    const userToUpload = await User.findOne({ token });
    userToUpload.salt = salt;
    userToUpload.hash = hash;
    await userToUpload.save();
    res.status(200).json({ userToUpload });
    // if (userToUpload) {
    // }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// delete user
router.post("/deleteUser", async (req, res) => {
  try {
    if (req.fields.email) {
      const user = await User.findOne({ email: req.fields.email });
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
