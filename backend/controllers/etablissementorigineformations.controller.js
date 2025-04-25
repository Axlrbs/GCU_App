const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const associations = await db.etablissementorigineformation.findAll({
      include: [
        { model: db.formation },
        { model: db.etablissement, include: [
            {model: db.ville, include : [
                {model: db.pays}
            ]}
        ] }
      ]
    });
    res.json(associations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const { formationId, etablissementId } = req.body;

    // Vérifie si l'association existe déjà
    const exists = await db.etablissementorigineformation.findOne({
      where: { formationId, etablissementId }
    });

    if (exists) return res.status(400).json({ message: 'Association déjà existante' });

    const newItem = await db.etablissementorigineformation.create({ formationId, etablissementId });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { formationId, etablissementId } = req.params;

    const association = await db.etablissementorigineformation.findOne({
      where: { formationId, etablissementId }
    });

    if (!association) return res.status(404).json({ message: 'Association non trouvée' });

    await association.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
