const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const decisions = await db.decisionJurys.findAll();
    res.json(decisions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const decision = await db.decisionJurys.findByPk(req.params.id);
    if (!decision) return res.status(404).json({ message: 'Décision non trouvée' });

    res.json(decision);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newDecision = await db.decisionJurys.create(req.body);
    res.status(201).json(newDecision);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const decision = await db.decisionJurys.findByPk(req.params.id);
    if (!decision) return res.status(404).json({ message: 'Décision non trouvée' });

    await decision.update(req.body);
    res.json(decision);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const decision = await db.decisionJurys.findByPk(req.params.id);
    if (!decision) return res.status(404).json({ message: 'Décision non trouvée' });

    await decision.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
