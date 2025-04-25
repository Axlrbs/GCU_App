const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/etablissements.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Etablissements
 *   description: Gestion des établissements
 */

/**
 * @swagger
 * /api/etablissements:
 *   get:
 *     summary: Lister tous les établissements
 *     tags: [Etablissements]
 *     responses:
 *       200:
 *         description: Liste des établissements
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/etablissements:
 *   post:
 *     summary: Créer un établissement
 *     tags: [Etablissements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomEtablissement
 *               - villeId
 *             properties:
 *               nomEtablissement:
 *                 type: string
 *                 example: Université de Grenoble
 *               contactEtablissement:
 *                 type: string
 *               villeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Établissement créé
 */
router.post(
  '/',
  verifyToken,
  [
    body('nomEtablissement').notEmpty().withMessage('Le nom est requis'),
    body('villeId').isInt().withMessage('La ville est requise')
  ],
  controller.create
);

/**
 * @swagger
 * /api/etablissements/{id}:
 *   get:
 *     summary: Récupérer un établissement
 *     tags: [Etablissements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Établissement trouvé
 *       404:
 *         description: Introuvable
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/etablissements/{id}:
 *   put:
 *     summary: Modifier un établissement
 *     tags: [Etablissements]
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
 *               nomEtablissement:
 *                 type: string
 *               contactEtablissement:
 *                 type: string
 *               villeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Établissement modifié
 */
router.put('/:id', verifyToken, controller.update);

/**
 * @swagger
 * /api/etablissements/{id}:
 *   delete:
 *     summary: Supprimer un établissement
 *     tags: [Etablissements]
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
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;
