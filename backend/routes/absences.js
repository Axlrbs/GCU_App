const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/absences.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Absences
 *   description: Gestion des absences des étudiants
 */

/**
 * @swagger
 * /api/absences:
 *   get:
 *     summary: Lister toutes les absences
 *     tags: [Absences]
 *     responses:
 *       200:
 *         description: Liste des absences
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/absences:
 *   post:
 *     summary: Ajouter une absence
 *     tags: [Absences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroEtudiant
 *               - dateAbsence
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               dateAbsence:
 *                 type: string
 *                 format: date
 *               commentaireAbsence:
 *                 type: string
 *     responses:
 *       201:
 *         description: Absence ajoutée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes'),
  [
    body('numeroEtudiant').isInt(),
    body('dateAbsence').notEmpty().withMessage('La date est obligatoire.')
  ],
  controller.create
);

/**
 * @swagger
 * /api/absences/{id}:
 *   put:
 *     summary: Modifier une absence
 *     tags: [Absences]
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
 *               dateAbsence:
 *                 type: string
 *                 format: date
 *               commentaireAbsence:
 *                 type: string
 *     responses:
 *       200:
 *         description: Absence mise à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes'), controller.update);

/**
 * @swagger
 * /api/absences/{id}:
 *   delete:
 *     summary: Supprimer une absence
 *     tags: [Absences]
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
 *         description: Absence supprimée
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes'), controller.remove);

module.exports = router;
