const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const pkg = require("./package.json");
const cors = require("cors");

const autoecole = require("./routes/autoecole");
const user = require("./routes/user");

app.use(cors());
app.use(bodyParser.json());

app.use(autoecole);
app.use(user);

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
