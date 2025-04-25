const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const types = await db.typeMobilite.findAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const type = await db.typeMobilite.findByPk(req.params.id,
        {include: [
            {model: db.mobilite}
        ]}
    );
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });

    res.json(type);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newType = await db.typeMobilite.create(req.body);
    res.status(201).json(newType);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const type = await db.typeMobilite.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });

    await type.update(req.body);
    res.json(type);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const type = await db.typeMobilite.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });

    await type.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
