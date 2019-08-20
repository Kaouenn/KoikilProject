const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const pkg = require("./package.json");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

/////////////////////////////////////////////////////////////// Se connecter à la base de données
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/KoikilDatabase",
  {
    useNewUrlParser: true
  }
);

app.get("/", (req, resp) =>
  resp.json({
    name: pkg.name,
    version: pkg.version
  })
);

const autoecole = require("./routes/autoecole");

app.use(autoecole);

const user = require("./routes/user");

app.use(user);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
