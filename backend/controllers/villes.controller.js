const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const villes = await db.ville.findAll({
      include: [{ model: db.pays}]
    });
    res.json(villes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const ville = await db.ville.findByPk(req.params.id, {
      include: [{ model: db.pays }]
    });
    if (!ville) return res.status(404).json({ message: 'Ville non trouvée' });
    res.json(ville);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const newItem = await db.ville.create(req.body);
  res.status(201).json(newItem);
};

exports.update = async (req, res) => {
  const item = await db.ville.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Ville non trouvée' });

  await item.update(req.body);
  res.json(item);
};

exports.remove = async (req, res) => {
  const item = await db.ville.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Ville non trouvée' });

  await item.destroy();
  res.status(204).send();
};
