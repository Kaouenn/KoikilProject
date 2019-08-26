const express = require("express");
const mongoose = require("mongoose");
const app = express();
const pkg = require("./package.json");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");

app.use(formidableMiddleware());
app.use(cors());

require("./models/autoecolemodel");
require("./models/usermodel");
require("./models/contractmodel");

const autoecole = require("./routes/autoecole");
const user = require("./routes/user");
const upload = require("./routes/upload");
const contract = require("./routes/contract");
const stripe = require("./routes/stripe");

//Activer les routes
app.use(autoecole);
app.use(user);
app.use(upload);s
app.use(contract);
app.use(stripe);

/////////////////////////////////////////////////////////////// Se connecter à la base de données
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/KoikilDatabase",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
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
