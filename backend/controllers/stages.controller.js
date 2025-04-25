const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const stages = await db.stage.findAll({
      include: [
        { model: db.etudiant, as: 'etudiant' },
        { model: db.entreprise, as: 'entreprise' },
        { model: db.tuteur, as: 'tuteurPro' },
        { model: db.tuteur, as: 'tuteurPedago' }
      ]
    });
    res.json(stages);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const stage = await db.stage.findByPk(req.params.id, {
      include: [
        { model: db.etudiant, as: 'etudiant' },
        { model: db.entreprise, as: 'entreprise' },
        { model: db.tuteur, as: 'tuteurPro' },
        { model: db.tuteur, as: 'tuteurPedago' }
      ]
    });
    if (!stage) return res.status(404).json({ message: 'Stage non trouvé' });
    res.json(stage);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const newStage = await db.stage.create(req.body);
  res.status(201).json(newStage);
};

exports.update = async (req, res) => {
  const stage = await db.stage.findByPk(req.params.id);
  if (!stage) return res.status(404).json({ message: 'Stage non trouvé' });

  await stage.update(req.body);
  res.json(stage);
};

exports.remove = async (req, res) => {
  const stage = await db.stage.findByPk(req.params.id);
  if (!stage) return res.status(404).json({ message: 'Stage non trouvé' });

  await stage.destroy();
  res.status(204).send();
};
