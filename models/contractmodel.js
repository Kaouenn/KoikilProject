const mongoose = require("mongoose");

const Contract = mongoose.model("Contract ", {
    numberContract: {
        type: Number
    },
    updated: { type: Date, default: Date.now },
    autoEcole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Autoecole"
  },
    name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = Contract;
