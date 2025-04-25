const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const annees = await db.anneeUniversitaire.findAll();
    res.json(annees);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const annee = await db.anneeUniversitaire.findByPk(req.params.id);
    if (!annee) return res.status(404).json({ message: 'Année non trouvée' });

    res.json(annee);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const nouvelleAnnee = await db.anneeUniversitaire.create(req.body);
    res.status(201).json(nouvelleAnnee);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const annee = await db.anneeUniversitaire.findByPk(req.params.id);
    if (!annee) return res.status(404).json({ message: 'Année non trouvée' });

    await annee.update(req.body);
    res.json(annee);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const annee = await db.anneeUniversitaire.findByPk(req.params.id);
    if (!annee) return res.status(404).json({ message: 'Année non trouvée' });

    await annee.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
