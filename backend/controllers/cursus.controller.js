const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const cursus = await db.cursus.findAll();
    res.json(cursus);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const cursus = await db.cursus.findByPk(req.params.id);
    if (!cursus) return res.status(404).json({ message: 'Cursus non trouvé' });

    res.json(cursus);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newCursus = await db.cursus.create(req.body);
    res.status(201).json(newCursus);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const cursus = await db.cursus.findByPk(req.params.id);
    if (!cursus) return res.status(404).json({ message: 'Cursus non trouvé' });

    await cursus.update(req.body);
    res.json(cursus);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const cursus = await db.cursus.findByPk(req.params.id);
    if (!cursus) return res.status(404).json({ message: 'Cursus non trouvé' });

    await cursus.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
