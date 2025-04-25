const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const formations = await db.formation.findAll();
    res.json(formations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const formation = await db.formation.findByPk(req.params.id, {
      include: [
        { model: db.etudiant, as: 'etudiants' },
        {
          model: db.etablissementorigineformation,
          as: 'etablissementorigineformations',
          include: [
            { model: db.etablissement, as: 'etablissement' }
          ]
        }
      ]
    });
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée' });
    res.json(formation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newFormation = await db.formation.create(req.body);
    res.status(201).json(newFormation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const formation = await db.formation.findByPk(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée' });

    await formation.update(req.body);
    res.json(formation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const formation = await db.formation.findByPk(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée' });

    await formation.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
