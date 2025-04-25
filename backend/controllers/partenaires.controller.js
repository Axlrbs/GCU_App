const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const partenaires = await db.partenaire.findAll();
    res.json(partenaires);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const partenaire = await db.partenaire.findByPk(req.params.id, {
      include: [
        {
          model: db.etudiantParticipePartenariat,
          as: 'etudiantParticipePartenariats',
          include: [
            { model: db.etudiant, as: 'etudiant' },
            { model: db.naturePartenariat, as: 'naturePartenariat' }
          ]
        }
      ]
    });
    if (!partenaire) return res.status(404).json({ message: 'Partenaire non trouvé' });
    res.json(partenaire);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newPartenaire = await db.partenaire.create(req.body);
    res.status(201).json(newPartenaire);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const partenaire = await db.partenaire.findByPk(req.params.id);
    if (!partenaire) return res.status(404).json({ message: 'Partenaire non trouvé' });

    await partenaire.update(req.body);
    res.json(partenaire);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const partenaire = await db.partenaire.findByPk(req.params.id);
    if (!partenaire) return res.status(404).json({ message: 'Partenaire non trouvé' });

    await partenaire.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
