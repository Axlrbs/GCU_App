const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/partenaires.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Partenaires
 *   description: Gestion des partenaires
 */

/**
 * @swagger
 * /api/partenaires:
 *   get:
 *     summary: Lister tous les partenaires
 *     tags: [Partenaires]
 *     responses:
 *       200:
 *         description: Liste des partenaires
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/partenaires:
 *   post:
 *     summary: Créer un partenaire
 *     tags: [Partenaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomPartenaire
 *               - secteurPartenaire
 *             properties:
 *               nomPartenaire:
 *                 type: string
 *               secteurPartenaire:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partenaire créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes'),
  [
    body('nomPartenaire').notEmpty().withMessage('Le nom est requis'),
    body('secteurPartenaire').notEmpty().withMessage('Le secteur est requis')
  ],
  controller.create
);

/**
 * @swagger
 * /api/partenaires/{id}:
 *   get:
 *     summary: Récupérer un partenaire par ID
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Données du partenaire
 *       404:
 *         description: Partenaire non trouvé
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/partenaires/{id}:
 *   put:
 *     summary: Modifier un partenaire
 *     tags: [Partenaires]
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
 *               nomPartenaire:
 *                 type: string
 *               secteurPartenaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partenaire mis à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes'), controller.update);

/**
 * @swagger
 * /api/partenaires/{id}:
 *   delete:
 *     summary: Supprimer un partenaire
 *     tags: [Partenaires]
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
  checkRole('admin', 'etudes'), controller.remove);

module.exports = router;
