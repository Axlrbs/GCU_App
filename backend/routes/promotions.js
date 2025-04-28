const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/promotions.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Gestion des promotions
 */

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Lister toutes les promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: Liste des promotions
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Créer une promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libellePromotion
 *             properties:
 *               libellePromotion:
 *                 type: string
 *                 example: Promo 2023-2026
 *     responses:
 *       201:
 *         description: Promotion créée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin'),
  [body('libellePromotion').notEmpty().withMessage('Le libellé est requis.')],
  controller.create
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Récupérer une promotion par ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion trouvée
 *       404:
 *         description: Promotion non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Modifier une promotion
 *     tags: [Promotions]
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
 *               libellePromotion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promotion mise à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin'), controller.update);

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Supprimer une promotion
 *     tags: [Promotions]
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
 *         description: Promotion supprimée
 */
router.delete('/:id', authenticateToken,
  checkRole('admin'), controller.remove);

module.exports = router;
