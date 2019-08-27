const express = require("express");
const router = express.Router();
const createStripe = require("stripe");
const cors = require("cors");
/* Votre clé privée doit être indiquée ici */

const stripe = createStripe("sk_test_FcQTuuEym2CYxtkcMdLAsoEg002eXGf3Eg");

router.use(cors());
// router.use(body.json());
// 5. on réceptionne le token
router.post("/charge", async (req, res) => {
  try {
    // 6. On envoie le token a Stripe avec le montant
    // (async () => {
    //   const customer = await stripe.customers.create({
    //     email: req.fields.customerEmail,
    //     source: req.fields.token
    //   });
    // })();

    let { status } = await stripe.charges.create({
      amount: 15000,
      currency: "eur",
      description: "test koikil paiement",
      source: req.fields.token
    });
    // 8. Le paiement a fonctionné
    // 9. On peut mettre à jour la base de données
    // 10. On renvoie une réponse au client pour afficher un message de statut
    res.json({ status });
  } catch (err) {
    console.log(err.message);
    res.status(500).end();
  }
});

module.exports = router;
