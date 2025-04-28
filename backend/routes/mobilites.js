const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/mobilites.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobilités
 *   description: Gestion des mobilités
 */

/**
 * @swagger
 * /api/mobilites:
 *   get:
 *     summary: Liste de toutes les mobilités
 *     tags: [Mobilités]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/mobilites:
 *   post:
 *     summary: Créer une mobilité
 *     tags: [Mobilités]
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
 *               - typeMobiliteId
 *               - anneeUniversitaireId
 *               - etatId
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               typeMobiliteId:
 *                 type: integer
 *               anneeUniversitaireId:
 *                 type: integer
 *               etatId:
 *                 type: integer
 *               commentaireMobilite:
 *                 type: string
 *     responses:
 *       201:
 *         description: Créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'mobilites'),
  [
    body('numeroEtudiant').isInt(),
    body('typeMobiliteId').isInt(),
    body('anneeUniversitaireId').isInt(),
    body('etatId').isInt()
  ],
  controller.create
);

/**
 * @swagger
 * /api/mobilites/{id}:
 *   get:
 *     summary: Obtenir une mobilité par ID
 *     tags: [Mobilités]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mobilité trouvée
 *       404:
 *         description: Mobilité non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/mobilites/{id}:
 *   put:
 *     summary: Modifier une mobilité
 *     tags: [Mobilités]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               commentaireMobilite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Modifiée
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'mobilites'), controller.update);

/**
 * @swagger
 * /api/mobilites/{id}:
 *   delete:
 *     summary: Supprimer une mobilité
 *     tags: [Mobilités]
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
  checkRole('admin', 'mobilites'), controller.remove);

module.exports = router;
