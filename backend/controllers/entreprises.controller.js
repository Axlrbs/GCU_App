const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const entreprises = await db.entreprise.findAll({
      include: [{ model: db.ville, as: 'ville' }]
    });
    res.json(entreprises);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const entreprise = await db.entreprise.findByPk(req.params.id, {
      include: [{ model: db.ville, as: 'ville' }]
    });
    if (!entreprise) return res.status(404).json({ message: 'Entreprise non trouvée' });
    res.json(entreprise);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const newItem = await db.entreprise.create(req.body);
  res.status(201).json(newItem);
};

exports.update = async (req, res) => {
  const item = await db.entreprise.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Entreprise non trouvée' });

  await item.update(req.body);
  res.json(item);
};

exports.remove = async (req, res) => {
  const item = await db.entreprise.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Entreprise non trouvée' });

  await item.destroy();
  res.status(204).send();
};
