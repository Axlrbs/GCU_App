const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const promos = await db.promotion.findAll();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const promo = await db.promotion.findByPk(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promotion non trouvée' });

    res.json(promo);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newPromo = await db.promotion.create(req.body);
    res.status(201).json(newPromo);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const promo = await db.promotion.findByPk(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promotion non trouvée' });

    await promo.update(req.body);
    res.json(promo);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const promo = await db.promotion.findByPk(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promotion non trouvée' });

    await promo.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
