// controllers/parcoursEtudiantParSemestre.controller.js
const db = require('../models');
const ParcoursEtudiantParSemestre = db.parcoursEtudiantParSemestre;

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100
    const offset = (page - 1) * limit;

    const { count, rows } = await ParcoursEtudiantParSemestre.findAndCountAll({
      include: [
        {model: db.etudiant}, 
        {model: db.parcours}, 
        {model: db.semestre},
        {model: db.anneeUniversitaire}],
      limit,
      offset,
      order: [['numeroEtudiant', 'ASC']] // Tu peux changer selon besoin
    });

    res.json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ParcoursEtudiantParSemestre.findByPk(req.params.id, {
      include: ['etudiant', 'parcour', 'semestre', 'anneeUniversitaire'],
    });
    if (!item) return res.status(404).json({ message: 'Entrée non trouvée' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await ParcoursEtudiantParSemestre.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await ParcoursEtudiantParSemestre.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedItem = await ParcoursEtudiantParSemestre.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Entrée non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await ParcoursEtudiantParSemestre.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Entrée non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
