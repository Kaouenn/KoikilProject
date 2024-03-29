const express = require("express");
const router = express.Router();
const createStripe = require("stripe");
const cors = require("cors");
const User = require("../models/usermodel");
/* Votre clé privée doit être indiquée ici */

const stripe = createStripe("sk_test_FcQTuuEym2CYxtkcMdLAsoEg002eXGf3Eg");

router.use(cors());

router.post("/charge", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      description: "Création compte client Koikil",
      source: req.fields.token,
      email: req.fields.email, // obtained with Stripe.js
      name: req.fields.name
    });
    console.log("customer ====>", customer);

    /////////////////////////////////////

    let { status } = await stripe.charges.create({
      amount: 15000,
      currency: "eur",
      description: "koikil paiement assurance",
      source: customer.source,
      customer: customer.id
    });

    console.log(
      "status.datatageule ===================================>",
      status
    );
    // if(status) {
    //   const userToUpdate= await User.findOne({})
    //   userToUpdate.billStatus = true;

    // }
    res.json({ status });
  } catch (err) {
    console.log("erreur du catch ===>", err.message);
    res.status(500).end();
  }
});

module.exports = router;
