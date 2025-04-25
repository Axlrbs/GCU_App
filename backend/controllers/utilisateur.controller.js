const db = require('../models');
const bcrypt = require('bcrypt');
const Utilisateur = db.utilisateur;

exports.getAll = async (req, res) => {
  try {
    const users = await Utilisateur.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, motDePasse, nom, prenom, role } = req.body;
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const newUser = await Utilisateur.create({
      email,
      motDePasse: hashedPassword,
      nom,
      prenom,
      role
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { motDePasse, ...rest } = req.body;
    if (motDePasse) {
      rest.motDePasse = await bcrypt.hash(motDePasse, 10);
    }
    const [updated] = await Utilisateur.update(rest, {
      where: { utilisateurId: req.params.id }
    });
    if (updated) {
      const updatedUser = await Utilisateur.findByPk(req.params.id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur de mise à jour', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Utilisateur.destroy({
      where: { utilisateurId: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression', error: error.message });
  }
};
