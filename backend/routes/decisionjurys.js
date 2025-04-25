const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/decisionjurys.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DecisionJurys
 *   description: Gestion des décisions de jury
 */

/**
 * @swagger
 * /api/decisionjurys:
 *   get:
 *     summary: Lister toutes les décisions de jury
 *     tags: [DecisionJurys]
 *     responses:
 *       200:
 *         description: Liste des décisions
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/decisionjurys:
 *   post:
 *     summary: Créer une décision de jury
 *     tags: [DecisionJurys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelleDecision
 *             properties:
 *               libelleDecision:
 *                 type: string
 *                 example: Admis
 *     responses:
 *       201:
 *         description: Décision créée
 */
router.post(
  '/',
  verifyToken,
  [body('libelleDecision').notEmpty().withMessage('Le libellé est requis.')],
  controller.create
);

/**
 * @swagger
 * /api/decisionjurys/{id}:
 *   get:
 *     summary: Récupérer une décision par ID
 *     tags: [DecisionJurys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Décision trouvée
 *       404:
 *         description: Non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/decisionjurys/{id}:
 *   put:
 *     summary: Modifier une décision
 *     tags: [DecisionJurys]
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
 *               libelleDecision:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mise à jour OK
 */
router.put('/:id', verifyToken, controller.update);

/**
 * @swagger
 * /api/decisionjurys/{id}:
 *   delete:
 *     summary: Supprimer une décision
 *     tags: [DecisionJurys]
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
