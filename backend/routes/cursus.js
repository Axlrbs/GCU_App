const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/cursus.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cursus
 *   description: Gestion des cursus (filières)
 */

/**
 * @swagger
 * /api/cursus:
 *   get:
 *     summary: Lister tous les cursus
 *     tags: [Cursus]
 *     responses:
 *       200:
 *         description: Liste des cursus
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/cursus:
 *   post:
 *     summary: Créer un cursus
 *     tags: [Cursus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cursusLibelle
 *             properties:
 *               cursusLibelle:
 *                 type: string
 *                 example: Génie Civil Urbain
 *     responses:
 *       201:
 *         description: Cursus créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  [body('cursusLibelle').notEmpty().withMessage('Le libellé est requis.')],
  controller.create
);

/**
 * @swagger
 * /api/cursus/{id}:
 *   get:
 *     summary: Récupérer un cursus par ID
 *     tags: [Cursus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cursus trouvé
 *       404:
 *         description: Cursus non trouvé
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/cursus/{id}:
 *   put:
 *     summary: Modifier un cursus
 *     tags: [Cursus]
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
 *               cursusLibelle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cursus mis à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/cursus/{id}:
 *   delete:
 *     summary: Supprimer un cursus
 *     tags: [Cursus]
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
 *         description: Cursus supprimé
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
