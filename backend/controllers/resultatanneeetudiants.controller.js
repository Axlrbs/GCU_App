const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const resultats = await db.resultatAnneeEtudiant.findAll({
      include: [
        { model: db.etudiant, as: 'etudiant' },
        { model: db.promotion, as: 'promotion' },
        { model: db.anneeUniversitaire, as: 'anneeUniversitaire' },
        { model: db.decisionJurys, as: 'decisionJury' }
      ]
    });
    res.json(resultats);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const resultat = await db.resultatAnneeEtudiant.findByPk(req.params.id, {
      include: ['etudiant', 'promotion', 'anneeUniversitaire', 'decisionJury']
    });
    if (!resultat) return res.status(404).json({ message: 'Résultat non trouvé' });

    res.json(resultat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newResultat = await db.resultatAnneeEtudiant.create(req.body);
    res.status(201).json(newResultat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const resultat = await db.resultatAnneeEtudiant.findByPk(req.params.id);
    if (!resultat) return res.status(404).json({ message: 'Résultat non trouvé' });

    await resultat.update(req.body);
    res.json(resultat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const resultat = await db.resultatAnneeEtudiant.findByPk(req.params.id);
    if (!resultat) return res.status(404).json({ message: 'Résultat non trouvé' });

    await resultat.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
