const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/etudiants.controller');
const { verify } = require('jsonwebtoken');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Etudiants
 *   description: Gestion des étudiants
 */

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
router.get('/', controller.getAll);

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
router.get('/:id', controller.getOne);

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
 *               cursusId:
 *                 type: integer
 *               sexe:
 *                 type: string
 *               statutetudiantid:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Étudiant créé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès interdit
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes'), // Seuls les admins ou etudes peuvent créer un étudiant
  [
    body('numeroEtudiant').isInt().withMessage('Le numéro étudiant doit être un entier.'),
    body('nomEtudiant').notEmpty().withMessage('Le nom est requis.'),
    body('prenomEtudiant').notEmpty().withMessage('Le prénom est requis.'),
    body('mailEtudiant').isEmail().withMessage('Email invalide.'),
  ],
  controller.create
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
router.put('/:id', 
  authenticateToken,
  checkRole('admin', 'etudes'),
  controller.update
);

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
router.delete('/:id', 
  authenticateToken,
  checkRole('admin'), 
  controller.remove);

module.exports = router;
