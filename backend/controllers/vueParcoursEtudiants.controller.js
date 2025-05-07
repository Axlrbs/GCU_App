// controllers/vueParcoursEtudiants.controller.js
const db = require('../models');
const VueParcoursEtudiants = db.vue_parcours_etudiants;

exports.getAll = async (req, res) => {
    try {
      const data = await VueParcoursEtudiants.findAll();
      res.json({ success: true, data });
    } catch (error) {
      console.error("Erreur lors de la récupération des données de la vue :", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
