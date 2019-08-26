const express = require("express");
const mongoose = require("mongoose");
const app = express();
const pkg = require("./package.json");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");

app.use(cors());
app.use(formidableMiddleware());

require("./models/autoecolemodel");
require("./models/usermodel");
require("./models/contractmodel");

const autoecole = require("./routes/autoecole");
const user = require("./routes/user");
const upload = require("./routes/upload");
const contract = require("./routes/contract");
const refund = require("./routes/refund");
const stripe = require("./routes/stripe");

//Activer les routes
app.use(autoecole);
app.use(user);
app.use(upload);
app.use(contract);
app.use(refund);
app.use(stripe);

/////////////////////////////////////////////////////////////// Se connecter à la base de données
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://heroku_8wkr3sdw:9avo2nr5opjvjnkhpuqq16h2is@ds211168.mlab.com:11168/heroku_8wkr3sdw",
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
