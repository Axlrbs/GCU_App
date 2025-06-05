const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const tuteurs = await db.tuteur.findAll({
      include: [
        { model: db.role, as: 'role' },
        { model: db.stage, as: 'stagesPro' },
        { model: db.stage, as: 'stagesPedago' }
      ],
      order: [['nomTuteur', 'ASC']]
    });
    res.json(tuteurs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const tuteur = await db.tuteur.findByPk(req.params.id, {
      include: [
        { model: db.role, as: 'role' },
        { model: db.stage, as: 'stagesPro' },
        { model: db.stage, as: 'stagesPedago' }
      ]
    });
    if (!tuteur) return res.status(404).json({ message: 'Tuteur non trouvé' });
    res.json(tuteur);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const newTuteur = await db.tuteur.create(req.body);
  res.status(201).json(newTuteur);
};

exports.update = async (req, res) => {
  const tuteur = await db.tuteur.findByPk(req.params.id);
  if (!tuteur) return res.status(404).json({ message: 'Tuteur non trouvé' });

  await tuteur.update(req.body);
  res.json(tuteur);
};

exports.remove = async (req, res) => {
  const tuteur = await db.tuteur.findByPk(req.params.id);
  if (!tuteur) return res.status(404).json({ message: 'Tuteur non trouvé' });

  await tuteur.destroy();
  res.status(204).send();
};
