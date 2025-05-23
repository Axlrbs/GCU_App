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

exports.changePassword = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.utilisateurId || req.user.id; // le middleware JWT doit injecter req.user.id
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: 'Les deux mots de passe sont obligatoires.' });

    const user = await Utilisateur.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });

    const match = await bcrypt.compare(oldPassword, user.motDePasse);
    if (!match)
      return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });

    // Optionnel : force un niveau de sécurité minimum sur le nouveau mot de passe
    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });

    user.motDePasse = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
