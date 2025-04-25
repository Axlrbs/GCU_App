const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/formations.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Formations
 *   description: Gestion des formations
 */

/**
 * @swagger
 * /api/formations:
 *   get:
 *     summary: Lister toutes les formations
 *     tags: [Formations]
 *     responses:
 *       200:
 *         description: Liste des formations
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/formations:
 *   post:
 *     summary: Créer une formation
 *     tags: [Formations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomFormation
 *             properties:
 *               nomFormation:
 *                 type: string
 *                 example: Génie Civil Urbain
 *     responses:
 *       201:
 *         description: Formation créée
 */
router.post(
  '/',
  verifyToken,
  [body('nomFormation').notEmpty()],
  controller.create
);

/**
 * @swagger
 * /api/formations/{id}:
 *   get:
 *     summary: Récupérer une formation par ID
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Données de la formation
 *       404:
 *         description: Formation non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/formations/{id}:
 *   put:
 *     summary: Modifier une formation
 *     tags: [Formations]
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
 *               nomFormation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Formation mise à jour
 */
router.put('/:id', verifyToken, controller.update);

/**
 * @swagger
 * /api/formations/{id}:
 *   delete:
 *     summary: Supprimer une formation
 *     tags: [Formations]
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
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;
