// controllers/parcours.controller.js
const db = require('../models');
const Parcours = db.parcours;

exports.getAll = async (req, res) => {
  try {
    const all = await Parcours.findAll();
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Parcours.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Parcours non trouvé' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Parcours.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Parcours.update(req.body, {
      where: { parcoursId: req.params.id },
    });
    if (updated) {
      const updatedItem = await Parcours.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Parcours non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Parcours.destroy({
      where: { parcoursId: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Parcours non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
