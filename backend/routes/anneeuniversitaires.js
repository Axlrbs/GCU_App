const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/anneeuniversitaires.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AnneeUniversitaires
 *   description: Gestion des années universitaires
 */

/**
 * @swagger
 * /api/anneeuniversitaires:
 *   get:
 *     summary: Lister toutes les années universitaires
 *     tags: [AnneeUniversitaires]
 *     responses:
 *       200:
 *         description: Liste des années
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/anneeuniversitaires:
 *   post:
 *     summary: Créer une année universitaire
 *     tags: [AnneeUniversitaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelleAnneeUniversitaire
 *               - dateDebut
 *               - dateFin
 *             properties:
 *               libelleAnneeUniversitaire:
 *                 type: string
 *                 example: 2024-2025
 *               dateDebut:
 *                 type: string
 *                 format: date
 *               dateFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Année créée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'gestionnaire'),
  [
    body('libelleAnneeUniversitaire').notEmpty().withMessage('Le libellé est requis'),
    body('dateDebut').isISO8601().withMessage('Date de début invalide'),
    body('dateFin').isISO8601().withMessage('Date de fin invalide')
  ],
  controller.create
);

/**
 * @swagger
 * /api/anneeuniversitaires/{id}:
 *   get:
 *     summary: Récupérer une année universitaire par ID
 *     tags: [AnneeUniversitaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Année trouvée
 *       404:
 *         description: Année non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/anneeuniversitaires/{id}:
 *   put:
 *     summary: Modifier une année universitaire
 *     tags: [AnneeUniversitaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelleAnneeUniversitaire:
 *                 type: string
 *               dateDebut:
 *                 type: string
 *                 format: date
 *               dateFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Année mise à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes','mobilites'), controller.update);

/**
 * @swagger
 * /api/anneeuniversitaires/{id}:
 *   delete:
 *     summary: Supprimer une année universitaire
 *     tags: [AnneeUniversitaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Supprimée
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes','mobilites'), controller.remove);

module.exports = router;
