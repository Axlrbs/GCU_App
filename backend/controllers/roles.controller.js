const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const roles = await db.role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const role = await db.role.findByPk(req.params.id, {
      include: [
        { model: db.tuteur }
      ]
    });
    if (!role) return res.status(404).json({ message: 'role non trouvé' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};




