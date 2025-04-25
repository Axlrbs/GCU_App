const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const certifications = await db.certificationLangue.findAll();
    res.json(certifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const certification = await db.certificationLangue.findByPk(req.params.id, {
      include: [
        {
          model: db.etudiantPasseCertification,
          as: 'etudiantPasseCertifications',
          include: [
            { model: db.etudiant, as: 'etudiant' }
          ]
        }
      ]
    });

    if (!certification) return res.status(404).json({ message: 'Certification non trouvée' });
    res.json(certification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newCertification = await db.certificationLangue.create(req.body);
    res.status(201).json(newCertification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const certification = await db.certificationLangue.findByPk(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification non trouvée' });

    await certification.update(req.body);
    res.json(certification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const certification = await db.certificationLangue.findByPk(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification non trouvée' });

    await certification.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
