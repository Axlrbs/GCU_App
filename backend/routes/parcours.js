const express = require('express');
const router = express.Router();
const controller = require('../controllers/parcours.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


/**
 * @swagger
 * tags:
 *   name: Parcours
 *   description: Gestion des parcours
 */

/**
 * @swagger
 * /api/parcours:
 *   get:
 *     summary: Récupère tous les parcours
 *     tags: [Parcours]
 *     responses:
 *       200:
 *         description: Liste des parcours
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/parcours/{id}:
 *   get:
 *     summary: Récupère un parcours par ID
 *     tags: [Parcours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du parcours
 *     responses:
 *       200:
 *         description: Parcours trouvé
 *       404:
 *         description: Parcours non trouvé
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/parcours:
 *   post:
 *     summary: Crée un nouveau parcours
 *     tags: [Parcours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomParcours
 *             properties:
 *               nomParcours:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parcours créé
 */
router.post('/', authenticateToken,
    checkRole('admin'),controller.create);

/**
 * @swagger
 * /api/parcours/{id}:
 *   put:
 *     summary: Met à jour un parcours
 *     tags: [Parcours]
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
 *               nomParcours:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parcours mis à jour
 */
router.put('/:id', authenticateToken,
    checkRole('admin'),controller.update);

/**
 * @swagger
 * /api/parcours/{id}:
 *   delete:
 *     summary: Supprime un parcours
 *     tags: [Parcours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Parcours supprimé
 */
router.delete('/:id',authenticateToken,
    checkRole('admin'), controller.delete);

module.exports = router;
