const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/etablissementorigineformations.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EtablissementOrigineFormation
 *   description: Associations entre établissements et formations
 */

/**
 * @swagger
 * /api/etablissementorigineformations:
 *   get:
 *     summary: Lister toutes les associations établissement-formation
 *     tags: [EtablissementOrigineFormation]
 *     responses:
 *       200:
 *         description: Liste des associations
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/etablissementorigineformations:
 *   post:
 *     summary: Créer une association
 *     tags: [EtablissementOrigineFormation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formationId
 *               - etablissementId
 *             properties:
 *               formationId:
 *                 type: integer
 *               etablissementId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Association créée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes'),
  [
    body('formationId').isInt(),
    body('etablissementId').isInt()
  ],
  controller.create
);

/**
 * @swagger
 * /api/etablissementorigineformations/{formationId}/{etablissementId}:
 *   delete:
 *     summary: Supprimer une association
 *     tags: [EtablissementOrigineFormation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formationId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: etablissementId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimée
 */
router.delete('/:formationId/:etablissementId', authenticateToken,
  checkRole('admin', 'etudes'), controller.remove);

module.exports = router;
