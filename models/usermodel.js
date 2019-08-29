const mongoose = require("mongoose");

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
    required: true,
    index: { unique: true, dropDups: true }
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
  // dateCreatedContract: {
  //   type: String,
  //   default: null
  // },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract"
  },
  // model Userupload pour le chargement de documents contrat, livret, Piece d'identite
  userUpload: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userupload"
  },
  autoEcole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Autoecole"
  }
});

module.exports = User;
