const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/tuteurs.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tuteurs
 *   description: Gestion des tuteurs
 */

/**
 * @swagger
 * /api/tuteurs:
 *   get:
 *     summary: Lister tous les tuteurs
 *     tags: [Tuteurs]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/tuteurs:
 *   post:
 *     summary: Créer un tuteur
 *     tags: [Tuteurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomTuteur
 *               - roleId
 *             properties:
 *               nomTuteur:
 *                 type: string
 *               prenomTuteur:
 *                 type: string
 *               mailTuteur:
 *                 type: string
 *               telephoneTuteur:
 *                 type: integer
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'),
  [
    body('nomTuteur').notEmpty(),
    body('roleId').isInt()
  ],
  controller.create
);

/**
 * @swagger
 * /api/tuteurs/{id}:
 *   get:
 *     summary: Obtenir un tuteur par ID
 *     tags: [Tuteurs]
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
 * /api/tuteurs/{id}:
 *   put:
 *     summary: Modifier un tuteur
 *     tags: [Tuteurs]
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
 *               nomTuteur:
 *                 type: string
 *               prenomTuteur:
 *                 type: string
 *               mailTuteur:
 *                 type: string
 *               roleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Modifié
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/tuteurs/{id}:
 *   delete:
 *     summary: Supprimer un tuteur
 *     tags: [Tuteurs]
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
 *         description: Supprimé
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
