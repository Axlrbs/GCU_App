/**
 * @swagger
 * tags:
 *   name: Etudiants
 *   description: Gestion des étudiants
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../models');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /api/etudiants:
 *   get:
 *     summary: Liste de tous les étudiants
 *     tags: [Etudiants]
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/', async (req, res) => {
  const data = await db.etudiant.findAll({ include: db.formation });
  res.json(data);
});

/**
 * @swagger
 * /api/etudiants/{id}:
 *   get:
 *     summary: Récupère un étudiant par ID
 *     tags: [Etudiants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'étudiant
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Étudiant trouvé
 */
router.get('/:id', async (req, res) => {
  const data = await db.etudiant.findByPk(req.params.id);
  res.json(data);
});

/**
 * @swagger
 * /api/etudiants:
 *   post:
 *     summary: Créer un nouvel étudiant
 *     tags: [Etudiants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroEtudiant
 *               - nomEtudiant
 *               - prenomEtudiant
 *               - mailEtudiant
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *                 example: 4016342
 *               nomEtudiant:
 *                 type: string
 *               prenomEtudiant:
 *                 type: string
 *               mailEtudiant:
 *                 type: string
 *               anneeArrivee:
 *                 type: integer
 *               anneeDiplomation:
 *                 type: integer
 *               formationId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Étudiant créé
 */
router.post(
  '/',
  auth,
  [
    body('numeroEtudiant').isInt().withMessage('Le numéro étudiant doit être un entier.'),
    body('nomEtudiant').notEmpty().withMessage('Le nom est requis.'),
    body('prenomEtudiant').notEmpty().withMessage('Le prénom est requis.'),
    body('mailEtudiant').isEmail().withMessage('Email invalide.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erreurs: errors.array() });
    }

    const newItem = await db.etudiant.create(req.body);
    res.status(201).json(newItem);
  }
);

/**
 * @swagger
 * /api/etudiants/{id}:
 *   put:
 *     summary: Met à jour un étudiant
 *     tags: [Etudiants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               mailEtudiant: alice.new@example.com
 *     responses:
 *       204:
 *         description: Mise à jour réussie
 */
router.put('/:id', async (req, res) => {
  await db.etudiant.update(req.body, { where: { numeroEtudiant: req.params.id } });
  res.sendStatus(204);
});

/**
 * @swagger
 * /api/etudiants/{id}:
 *   delete:
 *     summary: Supprime un étudiant
 *     tags: [Etudiants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Suppression réussie
 */
router.delete('/:id', async (req, res) => {
  await db.etudiant.destroy({ where: { numeroEtudiant: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
