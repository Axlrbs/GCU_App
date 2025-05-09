const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const natures = await db.naturePartenariat.findAll();
    res.json(natures);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const nature = await db.naturePartenariat.findByPk(req.params.id);

    if (!nature) return res.status(404).json({ message: 'Nature de partenariat non trouvée' });
    res.json(nature);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newNature = await db.naturePartenariat.create(req.body);
    res.status(201).json(newNature);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const nature = await db.naturePartenariat.findByPk(req.params.id);
    if (!nature) return res.status(404).json({ message: 'Nature de partenariat non trouvée' });

    await nature.update(req.body);
    res.json(nature);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const nature = await db.naturePartenariat.findByPk(req.params.id);
    if (!nature) return res.status(404).json({ message: 'Nature de partenariat non trouvée' });

    await nature.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
