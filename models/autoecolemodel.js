const mongoose = require("mongoose");

//creation des models AutoEcole

const Autoecole = mongoose.model("Autoecole", {
  Dept: Number,
  "Raison sociale": String,
  "N° agrément": String,
  Adresse: String,
  CP: String,
  Ville: String
});

module.exports = Autoecole;
