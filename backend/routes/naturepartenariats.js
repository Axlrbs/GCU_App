const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/naturepartenariats.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NaturePartenariats
 *   description: Gestion des natures de partenariat
 */

/**
 * @swagger
 * /api/naturepartenariats:
 *   get:
 *     summary: Lister toutes les natures de partenariat
 *     tags: [NaturePartenariats]
 *     responses:
 *       200:
 *         description: Liste des natures
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/naturepartenariats:
 *   post:
 *     summary: Créer une nature de partenariat
 *     tags: [NaturePartenariats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelleNaturePartenariat
 *             properties:
 *               libelleNaturePartenariat:
 *                 type: string
 *                 example: Mentorat
 *     responses:
 *       201:
 *         description: Nature créée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  [body('libelleNaturePartenariat').notEmpty().withMessage('Le libellé est requis')],
  controller.create
);

/**
 * @swagger
 * /api/naturepartenariats/{id}:
 *   get:
 *     summary: Récupérer une nature par ID
 *     tags: [NaturePartenariats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Données de la nature
 *       404:
 *         description: Non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/naturepartenariats/{id}:
 *   put:
 *     summary: Modifier une nature
 *     tags: [NaturePartenariats]
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
 *               libelleNaturePartenariat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mise à jour réussie
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/naturepartenariats/{id}:
 *   delete:
 *     summary: Supprimer une nature
 *     tags: [NaturePartenariats]
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
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
