const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/stages.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stages
 *   description: Gestion des stages
 */

/**
 * @swagger
 * /api/stages:
 *   get:
 *     summary: Liste des stages
 *     tags: [Stages]
 *     responses:
 *       200:
 *         description: Liste OK
 */
router.get('/', 
  authenticateToken,
  checkRole('admin', 'etudes', 'mobilites', 'stages', 'stages/mobilites', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  controller.getAll);

/**
 * @swagger
 * /api/stages:
 *   post:
 *     summary: Créer un stage
 *     tags: [Stages]
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
 *               - entrepriseId
 *               - anneeUniversitaireId
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               entrepriseId:
 *                 type: integer
 *               anneeUniversitaireId:
 *                 type: integer
 *               sujetStage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'),
  [
    body('numeroEtudiant').isInt(),
    body('entrepriseId').isInt(),
    body('anneeUniversitaireId').isInt()
  ],
  controller.create
);

/**
 * @swagger
 * /api/stages/{id}:
 *   get:
 *     summary: Obtenir un stage par ID
 *     tags: [Stages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trouvé
 *       404:
 *         description: Introuvable
 */
router.get('/:id', 
  authenticateToken,
  checkRole('admin', 'etudes', 'mobilites', 'stages', 'stages/mobilites', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  controller.getOne);

/**
 * @swagger
 * /api/stages/{id}:
 *   put:
 *     summary: Modifier un stage
 *     tags: [Stages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sujetStage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Modifié
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/stages/{id}:
 *   delete:
 *     summary: Supprimer un stage
 *     tags: [Stages]
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
  checkRole('admin', 'stages', 'stages/mobilites', 'stages/etudes', 'stages/mobilites/etudes'), controller.remove);

  /**
 * @swagger
 * /api/stages/tuteurs/role/{roleId}:
 *   get:
 *     summary: Obtenir les tuteurs par rôle
 *     tags: [Stages]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des tuteurs
 */
router.get('/tuteurs/role/:roleId', 
  authenticateToken,
  checkRole('admin', 'etudes', 'mobilites', 'stages', 'stages/mobilites', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  controller.getTuteursByRole);


module.exports = router;
