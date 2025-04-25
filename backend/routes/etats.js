const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/etats.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Etats
 *   description: Gestion des états (validation contrats, relevés, etc.)
 */

/**
 * @swagger
 * /api/etats:
 *   get:
 *     summary: Lister tous les états
 *     tags: [Etats]
 *     responses:
 *       200:
 *         description: Liste des états
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/etats:
 *   post:
 *     summary: Créer un nouvel état
 *     tags: [Etats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelleEtat
 *             properties:
 *               libelleEtat:
 *                 type: string
 *                 example: Validé
 *     responses:
 *       201:
 *         description: État créé
 */
router.post(
  '/',
  verifyToken,
  [body('libelleEtat').notEmpty().withMessage('Le libellé est obligatoire.')],
  controller.create
);

/**
 * @swagger
 * /api/etats/{id}:
 *   get:
 *     summary: Récupérer un état par ID
 *     tags: [Etats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: État trouvé
 *       404:
 *         description: État non trouvé
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/etats/{id}:
 *   put:
 *     summary: Modifier un état
 *     tags: [Etats]
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
 *               libelleEtat:
 *                 type: string
 *     responses:
 *       200:
 *         description: État mis à jour
 */
router.put('/:id', verifyToken, controller.update);

/**
 * @swagger
 * /api/etats/{id}:
 *   delete:
 *     summary: Supprimer un état
 *     tags: [Etats]
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
 *         description: État supprimé
 */
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;
