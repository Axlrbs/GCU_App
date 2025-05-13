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

exports.update = async (req, res) => {
  console.log('=== DÉBUT DE LA MÉTHODE UPDATE ===');
  console.log('Requête reçue pour ID:', req.params.id);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Erreurs de validation:', errors.array());
    return res.status(400).json({ erreurs: errors.array() });
  }

  try {
    const certification = await db.etudiantPasseCertification.findByPk(req.params.id);
    if (!certification) {
      console.log('Certification non trouvée');
      return res.status(404).json({ message: 'Certification non trouvée' });
    }

    console.log('Certification trouvée:', certification.id);
    console.log('Anciennes valeurs:', {
      numeroEtudiant: certification.numeroEtudiant,
      certificationLangueId: certification.certificationLangueId,
      scoreCertification: certification.scoreCertification
    });

    await certification.update({
      numeroEtudiant: req.body.numeroEtudiant,
      certificationLangueId: req.body.certificationLangueId,
      scoreCertification: req.body.score
    });

    console.log('Mise à jour effectuée');
    
    const updatedCertification = await db.etudiantPasseCertification.findByPk(req.params.id, {
      include: [
        { model: db.etudiant, as: 'etudiant' },
        { model: db.certificationLangue, as: 'certificationLangue' }
      ]
    });
    
    console.log('Nouvelles valeurs:', {
      numeroEtudiant: updatedCertification.numeroEtudiant,
      certificationLangueId: updatedCertification.certificationLangueId,
      scoreCertification: updatedCertification.scoreCertification
    });

    res.json(updatedCertification);
  } catch (err) {
    console.error('ERREUR:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
