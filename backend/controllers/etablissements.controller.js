const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const etablissements = await db.etablissement.findAll({
      include: [{ model: db.ville}]
    });
    res.json(etablissements);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const etablissement = await db.etablissement.findByPk(req.params.id, {
      include: [{ model: db.ville, include: [
        {model: db.pays}
      ]}]
    });
    if (!etablissement) return res.status(404).json({ message: 'Établissement non trouvé' });
    res.json(etablissement);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const newItem = await db.etablissement.create(req.body);
  res.status(201).json(newItem);
};

exports.update = async (req, res) => {
  const item = await db.etablissement.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Établissement non trouvé' });

  await item.update(req.body);
  res.json(item);
};

exports.remove = async (req, res) => {
  const item = await db.etablissement.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Établissement non trouvé' });

  await item.destroy();
  res.status(204).send();
};
