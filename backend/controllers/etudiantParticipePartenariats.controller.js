const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await db.etudiantParticipePartenariat.findAndCountAll({
      include: [
        { model: db.etudiant },
        { model: db.partenaire},
        { model: db.naturePartenariat }
      ],
      limit,
      offset,
      order: [['numeroEtudiant', 'ASC']]
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

exports.getWithoutEtudiant = async (req, res) => {
  try {
    const participations = await db.etudiantParticipePartenariat.findAll({
      where: {
        numeroEtudiant: null
      },
      include: [
        { model: db.partenaire },
        { model: db.naturePartenariat }
      ]
    });
    res.json({ success: true, data: participations });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newParticipation = await db.etudiantParticipePartenariat.create(req.body);
    res.status(201).json(newParticipation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const participation = await db.etudiantParticipePartenariat.findByPk(req.params.id);
    if (!participation) return res.status(404).json({ message: 'Participation non trouvée' });

    await participation.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
