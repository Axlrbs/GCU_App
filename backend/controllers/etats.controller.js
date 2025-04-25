const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const etats = await db.etat.findAll();
    res.json(etats);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const etat = await db.etat.findByPk(req.params.id);
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });

    res.json(etat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newEtat = await db.etat.create(req.body);
    res.status(201).json(newEtat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const etat = await db.etat.findByPk(req.params.id);
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });

    await etat.update(req.body);
    res.json(etat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const etat = await db.etat.findByPk(req.params.id);
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });

    await etat.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
