const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  const etudiants = await db.etudiant.findAll({ 
    include: [
      {model: db.formation},
      {model:db.cursus},
      {model: db.statutetudiant}
  ]
     });
  res.json(etudiants);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }

  const newEtu = await db.etudiant.create(req.body);
  res.status(201).json(newEtu);
};

exports.getOne = async (req, res) => {
    const etu = await db.etudiant.findByPk(req.params.id, 
      {include: [
        {model: db.formation},
        {model:db.cursus},
        {model: db.statutetudiant}
      ]
    });
    if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json(etu);
  };
  
exports.update = async (req, res) => {
    const etu = await db.etudiant.findByPk(req.params.id);
    if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });

    await etu.update(req.body);
    res.json(etu);
};

exports.remove = async (req, res) => {
    const etu = await db.etudiant.findByPk(req.params.id);
    if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });

    await etu.destroy();
    res.status(204).send();
};
  