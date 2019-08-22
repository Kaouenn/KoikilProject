const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Autoecole = require("../models/autoecolemodel");

///////requete tye "create"
router.post("/autoecole/create", async (req, res) => {
  for (let i = 0; i < tab.length; i++) {
    try {
      const newAutoecole = new Autoecole({
        Dept: tab[i].Dept,
        "Raison sociale": tab[i]["Raison sociale"],
        "N° agrément": tab[i]["N° agrément"],
        Adresse: tab[i].Adresse,
        CP: tab[i].CP,
        Ville: tab[i].Ville
      });
      await newAutoecole.save();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  res.json({ message: "All Auto Ecole Created" });
});

///route READ Get des auto-ecoles
router.get("/autoecole", async (req, res) => {
  try {
    const autoecole = await Autoecole.find();
    res.json(autoecole);
  } catch (error) {
    return res.status(400).json({
      error: {
        message: "An error occured"
      }
    });
  }
});

router.get("/CP", async (req, res) => {
  try {
    const autoecoleCp = await Autoecole.find({ CP: req.query.cp });
    res.json(autoecoleCp);
  } catch (error) {
    return res.status(400).json({
      error: {
        message: "An error occured"
      }
    });
  }
});

module.exports = router;
