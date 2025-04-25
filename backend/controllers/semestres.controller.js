const db = require('../models');
const Semestre = db.semestre;

exports.getAll = async (req, res) => {
  try {
    const semestres = await Semestre.findAll();
    res.json(semestres);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const semestre = await Semestre.findByPk(req.params.id);
    if (!semestre) return res.status(404).json({ message: 'Semestre non trouvé' });
    res.json(semestre);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newSemestre = await Semestre.create(req.body);
    res.status(201).json(newSemestre);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Semestre.update(req.body, {
      where: { semestreId: req.params.id },
    });
    if (updated) {
      const updatedSemestre = await Semestre.findByPk(req.params.id);
      res.json(updatedSemestre);
    } else {
      res.status(404).json({ message: 'Semestre non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Semestre.destroy({
      where: { semestreId: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Semestre non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
