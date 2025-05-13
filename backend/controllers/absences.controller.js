const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100
    const offset = (page - 1) * limit;

    const { count, rows } = await db.absence.findAndCountAll({
        include: [
          { model: db.etudiant },
          { model: db.anneeUniversitaire}
        ],
        limit,
        offset,
        order: [['numeroetudiant', 'ASC']] // Tu peux changer selon besoin
      });

    res.json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newAbsence = await db.absence.create(req.body);
    res.status(201).json(newAbsence);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const absence = await db.absence.findByPk(req.params.id);
    if (!absence) return res.status(404).json({ message: 'Absence non trouvée' });

    await absence.update(req.body);
    res.json(absence);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const absence = await db.absence.findByPk(req.params.id);
    if (!absence) return res.status(404).json({ message: 'Absence non trouvée' });

    await absence.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const absence = await db.absence.findByPk(req.params.id, {
      include: [
        { 
          model: db.etudiant,
          attributes: ['numeroEtudiant', 'nomEtudiant', 'prenomEtudiant']
        },
        { 
          model: db.anneeUniversitaire,
          attributes: ['anneeUniversitaireId', 'libelleAnneeUniversitaire']
        }
      ]
    });

    if (!absence) {
      return res.status(404).json({ 
        success: false,
        message: 'Absence non trouvée'
      });
    }

    res.json({
      success: true,
      data: absence
    });
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'absence:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur',
      error: err.message 
    });
  }
};

exports.getAllByYear = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100 comme dans getAll
    const offset = (page - 1) * limit;
    const anneeUniversitaireId = parseInt(req.query.anneeUniversitaireId);

    // Vérifier si anneeUniversitaireId est fourni
    if (!anneeUniversitaireId) {
      return res.status(400).json({ 
        success: false,
        message: "L'ID de l'année universitaire est requis" 
      });
    }

    // Construire la requête avec le filtre sur l'année universitaire
    const { count, rows } = await db.absence.findAndCountAll({
      where: {
        anneeUniversitaireId: anneeUniversitaireId
      },
      include: [
        {
          model: db.etudiant,
          attributes: ['numeroEtudiant', 'nomEtudiant', 'prenomEtudiant']
        },
        {
          model: db.anneeUniversitaire,
          attributes: ['anneeUniversitaireId', 'libelleAnneeUniversitaire']
        }
      ],
      offset: offset,
      limit: limit,
      order: [['dateDebutAbsence', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count
    });

  } catch (err) {
    console.error('Erreur lors de la récupération des absences:', err);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération des absences",
      error: err.message
    });
  }
};
