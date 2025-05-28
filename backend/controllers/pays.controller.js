const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const pays = await db.pays.findAll({
      include: [{ model: db.ville}],
      order: [['nomPays', 'ASC']]
    });
    res.json(pays);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const pays = await db.pays.findByPk(req.params.codePays, {
      include: [{ model: db.ville}]
    });
    if (!pays) return res.status(404).json({ message: 'Pays non trouvé' });
    res.json(pays);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const newItem = await db.pays.create(req.body);
  res.status(201).json(newItem);
};

exports.update = async (req, res) => {
  const item = await db.pays.findByPk(req.params.codePays);
  if (!item) return res.status(404).json({ message: 'Pays non trouvé' });

  await item.update(req.body);
  res.json(item);
};

exports.remove = async (req, res) => {
  const item = await db.pays.findByPk(req.params.codePays);
  if (!item) return res.status(404).json({ message: 'Pays non trouvé' });

  await item.destroy();
  res.status(204).send();
};
