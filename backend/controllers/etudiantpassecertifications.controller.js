const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const etudiantCertifications = await db.etudiantPasseCertification.findAll({
      include: [
        { model: db.etudiant, as: 'etudiant' },
        { model: db.certificationLangue, as: 'certificationLangue' }
      ]
    });
    res.json(etudiantCertifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newCertification = await db.etudiantPasseCertification.create(req.body);
    res.status(201).json(newCertification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const certification = await db.etudiantPasseCertification.findByPk(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification non trouvée' });

    await certification.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
