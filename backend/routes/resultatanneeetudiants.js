const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/resultatanneeetudiants.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ResultatsAnneeEtudiant
 *   description: Suivi des résultats annuels des étudiants
 */

/**
 * @swagger
 * /api/resultatanneeetudiants:
 *   get:
 *     summary: Lister tous les résultats annuels
 *     tags: [ResultatsAnneeEtudiant]
 *     responses:
 *       200:
 *         description: Liste des résultats
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/resultatanneeetudiants:
 *   post:
 *     summary: Créer un résultat annuel
 *     tags: [ResultatsAnneeEtudiant]
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
 *               - promotionId
 *               - anneeUniversitaireId
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               promotionId:
 *                 type: integer
 *               anneeUniversitaireId:
 *                 type: integer
 *               moyenne:
 *                 type: number
 *               decisionJuryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Résultat créé
 */
router.post(
  '/',
  verifyToken,
  [
    body('numeroEtudiant').isInt().withMessage('Numéro étudiant requis'),
    body('promotionId').isInt().withMessage('Promotion requise'),
    body('anneeUniversitaireId').isInt().withMessage('Année universitaire requise')
  ],
  controller.create
);

/**
 * @swagger
 * /api/resultatanneeetudiants/{id}:
 *   get:
 *     summary: Obtenir un résultat par ID
 *     tags: [ResultatsAnneeEtudiant]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Résultat trouvé
 *       404:
 *         description: Résultat non trouvé
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/resultatanneeetudiants/{id}:
 *   put:
 *     summary: Modifier un résultat annuel
 *     tags: [ResultatsAnneeEtudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moyenne:
 *                 type: number
 *               decisionJuryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Résultat mis à jour
 */
router.put('/:id', verifyToken, controller.update);

/**
 * @swagger
 * /api/resultatanneeetudiants/{id}:
 *   delete:
 *     summary: Supprimer un résultat
 *     tags: [ResultatsAnneeEtudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé
 */
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;
