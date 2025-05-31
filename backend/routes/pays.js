const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/pays.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pays
 *   description: Gestion des pays
 */

/**
 * @swagger
 * /api/pays:
 *   get:
 *     summary: Lister tous les pays
 *     tags: [Pays]
 *     responses:
 *       200:
 *         description: Liste des pays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codePays:
 *                     type: string
 *                   nomPays:
 *                     type: string
 *                   villes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         villeId:
 *                           type: integer
 *                         nomVille:
 *                           type: string
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/pays:
 *   post:
 *     summary: Créer un pays
 *     tags: [Pays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codePays
 *               - nomPays
 *             properties:
 *               codePays:
 *                 type: string
 *                 example: "FR"
 *               nomPays:
 *                 type: string
 *                 example: "France"
 *     responses:
 *       201:
 *         description: Pays créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages', 'mobilites', 'stages/etudes', 'stages/mobilites', 'mobilites/etudes', 'stages/mobilites/etudes'),
  [
    body('codePays').notEmpty().withMessage('Le code du pays est requis.'),
    body('nomPays').notEmpty().withMessage('Le nom du pays est requis.')
  ],
  controller.create
);

/**
 * @swagger
 * /api/pays/{codePays}:
 *   get:
 *     summary: Obtenir un pays par son code
 *     tags: [Pays]
 *     parameters:
 *       - in: path
 *         name: codePays
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Données du pays
 *       404:
 *         description: Pays non trouvé
 */
router.get('/:codePays', controller.getOne);

/**
 * @swagger
 * /api/pays/{codePays}:
 *   put:
 *     summary: Modifier un pays
 *     tags: [Pays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codePays
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomPays:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pays modifié
 */
router.put('/:codePays', authenticateToken,
  checkRole('admin', 'etudes', 'stages', 'mobilites', 'stages/etudes', 'stages/mobilites', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/pays/{codePays}:
 *   delete:
 *     summary: Supprimer un pays
 *     tags: [Pays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codePays
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 */
router.delete('/:codePays', authenticateToken,
  checkRole('admin', 'etudes', 'stages', 'mobilites', 'stages/etudes', 'stages/mobilites', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
