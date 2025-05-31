const express = require('express');
const router = express.Router();
const natCtrl = require('../controllers/nationalites.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Nationalites
 *   description: Gestion des nationalités
 */

/**
 * @swagger
 * /api/nationalites:
 *   get:
 *     summary: Liste toutes les nationalités avec le nom du pays associé
 *     tags: [Nationalites]
 *     responses:
 *       200:
 *         description: Liste des nationalités
 */
router.get('/', natCtrl.getAllNationalites);

/**
 * @swagger
 * /api/nationalites/{id}:
 *   get:
 *     summary: Récupère une nationalité par ID
 *     tags: [Nationalites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la nationalité
 *     responses:
 *       200:
 *         description: Nationalité trouvée
 *       404:
 *         description: Nationalité non trouvée
 */
router.get('/:id', natCtrl.getNationaliteById);

/**
 * @swagger
 * /api/nationalites:
 *   post:
 *     summary: Crée une nationalité
 *     tags: [Nationalites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libellenationalite:
 *                 type: string
 *               codePays:
 *                 type: string
 *     responses:
 *       201:
 *         description: Nationalité créée
 */
router.post('/', authenticateToken, checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), natCtrl.createNationalite);

/**
 * @swagger
 * /api/nationalites/{id}:
 *   put:
 *     summary: Modifie une nationalité
 *     tags: [Nationalites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la nationalité
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libellenationalite:
 *                 type: string
 *               codePays:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nationalité modifiée
 *       404:
 *         description: Nationalité non trouvée
 */
router.put('/:id', authenticateToken, checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), natCtrl.updateNationalite);

/**
 * @swagger
 * /api/nationalites/{id}:
 *   delete:
 *     summary: Supprime une nationalité
 *     tags: [Nationalites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la nationalité
 *     responses:
 *       200:
 *         description: Nationalité supprimée
 *       404:
 *         description: Nationalité non trouvée
 */
router.delete('/:id', authenticateToken, checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), natCtrl.deleteNationalite);

module.exports = router;
