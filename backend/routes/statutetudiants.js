const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, checkRole } = require('../middlewares/auth');
const controller = require('../controllers/statutetudiants.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     StatutEtudiant:
 *       type: object
 *       required:
 *         - libellestatutetudiant
 *       properties:
 *         statutetudiantid:
 *           type: integer
 *           description: L'ID auto-généré du statut étudiant
 *         libellestatutetudiant:
 *           type: string
 *           maxLength: 50
 *           description: Le libellé du statut étudiant
 *       example:
 *         statutetudiantid: 1
 *         libellestatutetudiant: Standard
 */

/**
 * @swagger
 * tags:
 *   name: StatutEtudiants
 *   description: API pour gérer les statuts des étudiants
 */

/**
 * @swagger
 * /api/statutetudiants:
 *   get:
 *     summary: Retourne la liste de tous les statuts étudiants
 *     tags: [StatutEtudiants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des statuts étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StatutEtudiant'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/statutetudiants/{id}:
 *   get:
 *     summary: Obtenir un statut étudiant par son ID
 *     tags: [StatutEtudiants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du statut étudiant
 *     responses:
 *       200:
 *         description: Statut étudiant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatutEtudiant'
 *       404:
 *         description: Statut étudiant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', controller.findOne);

/**
 * @swagger
 * /api/statutetudiants:
 *   post:
 *     summary: Créer un nouveau statut étudiant
 *     tags: [StatutEtudiants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libellestatutetudiant
 *             properties:
 *               libellestatutetudiant:
 *                 type: string
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: Statut étudiant créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatutEtudiant'
 *       500:
 *         description: Erreur serveur
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes'),
  [body('libellestatutetudiant').notEmpty().withMessage('Le libellé est requis')],
  controller.create
);

/**
 * @swagger
 * /api/statutetudiants/{id}:
 *   put:
 *     summary: Mettre à jour un statut étudiant
 *     tags: [StatutEtudiants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du statut étudiant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libellestatutetudiant:
 *                 type: string
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Statut étudiant mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatutEtudiant'
 *       404:
 *         description: Statut étudiant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', authenticateToken, checkRole('admin', 'etudes'), controller.update);

/**
 * @swagger
 * /api/statutetudiants/{id}:
 *   delete:
 *     summary: Supprimer un statut étudiant
 *     tags: [StatutEtudiants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du statut étudiant
 *     responses:
 *       200:
 *         description: Statut étudiant supprimé avec succès
 *       404:
 *         description: Statut étudiant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authenticateToken, checkRole('admin'), controller.delete);

module.exports = router;