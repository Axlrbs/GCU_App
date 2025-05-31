const express = require('express');
const router = express.Router();
const laboCtrl = require('../controllers/laboratoires.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Laboratoires
 *   description: Gestion des laboratoires
 */

/**
 * @swagger
 * /api/laboratoires:
 *   get:
 *     summary: Liste tous les laboratoires avec leur établissement, ville et pays
 *     tags: [Laboratoires]
 *     responses:
 *       200:
 *         description: Liste des laboratoires
 */
router.get('/', laboCtrl.getAllLaboratoires);

/**
 * @swagger
 * /api/laboratoires/{id}:
 *   get:
 *     summary: Récupère un laboratoire par ID
 *     tags: [Laboratoires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du laboratoire
 *     responses:
 *       200:
 *         description: Laboratoire trouvé
 *       404:
 *         description: Laboratoire non trouvé
 */
router.get('/:id', laboCtrl.getLaboratoireById);

/**
 * @swagger
 * /api/laboratoires:
 *   post:
 *     summary: Crée un laboratoire
 *     tags: [Laboratoires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomlaboratoire:
 *                 type: string
 *               etablissementId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Laboratoire créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  laboCtrl.createLaboratoire
);

/**
 * @swagger
 * /api/laboratoires/{id}:
 *   put:
 *     summary: Modifie un laboratoire
 *     tags: [Laboratoires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du laboratoire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomlaboratoire:
 *                 type: string
 *               etablissementId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Laboratoire modifié
 *       404:
 *         description: Laboratoire non trouvé
 */
router.put(
  '/:id',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  laboCtrl.updateLaboratoire
);

/**
 * @swagger
 * /api/laboratoires/{id}:
 *   delete:
 *     summary: Supprime un laboratoire
 *     tags: [Laboratoires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du laboratoire
 *     responses:
 *       200:
 *         description: Laboratoire supprimé
 *       404:
 *         description: Laboratoire non trouvé
 */
router.delete(
  '/:id',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  laboCtrl.deleteLaboratoire
);

module.exports = router;
