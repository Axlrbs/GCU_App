const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/entreprises.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Entreprises
 *   description: Gestion des entreprises
 */

/**
 * @swagger
 * /api/entreprises:
 *   get:
 *     summary: Liste des entreprises
 *     tags: [Entreprises]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/entreprises:
 *   post:
 *     summary: Créer une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - raisonSociale
 *               - villeId
 *             properties:
 *               raisonSociale:
 *                 type: string
 *               contactEntreprise:
 *                 type: string
 *               villeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Créée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'),
  [
    body('raisonSociale').notEmpty(),
    body('villeId').isInt()
  ],
  controller.create
);

/**
 * @swagger
 * /api/entreprises/{id}:
 *   get:
 *     summary: Obtenir une entreprise par ID
 *     tags: [Entreprises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Introuvable
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/entreprises/{id}:
 *   put:
 *     summary: Modifier une entreprise
 *     tags: [Entreprises]
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
 *               raisonSociale:
 *                 type: string
 *               contactEntreprise:
 *                 type: string
 *               villeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/entreprises/{id}:
 *   delete:
 *     summary: Supprimer une entreprise
 *     tags: [Entreprises]
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
 *         description: Supprimée
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
