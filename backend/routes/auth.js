// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const Utilisateur = db.utilisateur;

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur et génération d'un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie avec token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Email ou mot de passe invalide
 */

router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = jwt.sign(
      { id: user.utilisateurId, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        utilisateurId: user.utilisateurId,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;