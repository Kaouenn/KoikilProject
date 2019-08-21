const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const pkg = require("./package.json");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");


app.use(formidableMiddleware());

const autoecole = require("./routes/autoecole");
const user = require("./routes/user");

app.use(cors());
app.use(bodyParser.json());

app.use(autoecole);
app.use(user);


require("./models/autoecolemodel");
require("./models/usermodel");

const autoecole = require("./routes/autoecole");
const user = require("./routes/user");
const upload = require("./routes/upload");

//Activer les routes
app.use(autoecole);
app.use(user);
app.use(upload);

/////////////////////////////////////////////////////////////// Se connecter à la base de données

// Se connecter à la base de données

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

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
