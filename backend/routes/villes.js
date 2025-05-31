const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/villes.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Villes
 *   description: Gestion des villes
 */

/**
 * @swagger
 * /api/villes:
 *   get:
 *     summary: Lister toutes les villes
 *     tags: [Villes]
 *     responses:
 *       200:
 *         description: Liste des villes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   villeId:
 *                     type: integer
 *                   nomVille:
 *                     type: string
 *                   codePays:
 *                     type: string
 *                   pay:
 *                     type: object
 *                     properties:
 *                       codePays:
 *                         type: string
 *                       nomPays:
 *                         type: string
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/villes:
 *   post:
 *     summary: Créer une nouvelle ville
 *     tags: [Villes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomVille
 *               - codePays
 *             properties:
 *               nomVille:
 *                 type: string
 *                 example: "Paris"
 *               codePays:
 *                 type: string
 *                 example: "FR"
 *     responses:
 *       201:
 *         description: Ville créée avec succès
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages', 'mobilites', 'stages/etudes', 'stages/mobilites', 'mobilites/etudes', 'stages/mobilites/etudes'),
  [
    body('nomVille').notEmpty().withMessage('Le nom de la ville est requis.'),
    body('codePays').notEmpty().withMessage('Le code du pays est requis.')
  ],
  controller.create
);

/**
 * @swagger
 * /api/villes/{id}:
 *   get:
 *     summary: Récupérer une ville par ID
 *     tags: [Villes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Données de la ville
 *       404:
 *         description: Ville non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/villes/{id}:
 *   put:
 *     summary: Modifier une ville
 *     tags: [Villes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomVille:
 *                 type: string
 *               codePays:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ville modifiée
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages', 'mobilites', 'stages/etudes', 'stages/mobilites', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/villes/{id}:
 *   delete:
 *     summary: Supprimer une ville
 *     tags: [Villes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ville supprimée
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages', 'mobilites', 'stages/etudes', 'stages/mobilites', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
