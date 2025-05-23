const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/resultatanneeetudiants.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


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
  authenticateToken,
  checkRole('admin', 'etudes'),
  [
    body('numeroEtudiant').isInt().withMessage('Numéro étudiant requis'),
    body('promotionId').isInt().withMessage('Promotion requise'),
    body('anneeUniversitaireId').isInt().withMessage('Année universitaire requise')
  ],
  controller.create
);

/**
 * @swagger
 * /api/resultatanneeetudiants/resultatanneeetudiant:
 *   get:
 *     tags: [Historique Académique]
 *     summary: Récupère l'historique académique d'un étudiant
 *     parameters:
 *       - in: query
 *         name: numeroEtudiant
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro de l'étudiant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique récupéré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       resultatId:
 *                       anneeUniversitaireId:
 *                         type: integer
 *                       anneeUniversitaire:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           libelle:
 *                             type: string
 *                       promotionId:
 *                         type: integer
 *                       promotion:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           libelle:
 *                             type: string
 *                       codeDecision:
 *                         type: string
 *       400:
 *         description: Paramètre manquant
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/resultatanneeetudiant',
  controller.getHistoryByStudent
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
 *               decisionJuryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Résultat mis à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes'), controller.update);

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
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes'), controller.remove);

// --- resultatanneeetudiants.js (router) ---
/**
 * @swagger
 * /api/resultatanneeetudiants/etudiant/{numeroEtudiant}/annee/{anneeUniversitaireId}:
 *   put:
 *     summary: Modifier un résultat annuel par numéro étudiant et année universitaire
 *     tags: [ResultatsAnneeEtudiant]
 *     parameters:
 *       - in: path
 *         name: numeroEtudiant
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: anneeUniversitaireId
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotionId
 *             properties:
 *               promotionId:
 *                 type: integer
 *                 description: ID de la promotion (obligatoire)
 *               codeDecision:
 *                 type: string
 *                 description: Code de la décision du jury (optionnel)
 *               dateDecisionJurys:
 *                 type: string
 *                 format: date
 *                 description: Date de la décision du jury au format YYYY-MM-DD (optionnel)
 *     responses:
 *       200:
 *         description: Résultat mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Résultat mis à jour avec succès"
 *                 data:
 *                   type: object
 *       400:
 *         description: Requête invalide (promotionId manquant ou invalide)
 *       404:
 *         description: Résultat non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
  '/etudiant/:numeroEtudiant/annee/:anneeUniversitaireId',
  authenticateToken,
  checkRole('admin', 'etudes'),
  controller.updateByCompositeKey
);

/**
 * @swagger
 * /api/resultatanneeetudiants/resultatanneeetudiant/etudiant/{numeroEtudiant}/annee/{anneeUniversitaireId}:
 *   get:
 *     summary: Récupérer un résultat annuel spécifique par numéro d'étudiant et année universitaire
 *     tags: [ResultatsAnneeEtudiant]
 *     parameters:
 *       - in: path
 *         name: numeroEtudiant
 *         schema:
 *           type: integer
 *         description: Numéro de l'étudiant
 *       - in: path
 *         name: anneeUniversitaireId
 *         schema:
 *           type: integer
 *         description: ID de l'année universitaire
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Résultat trouvé
 *       404:
 *         description: Résultat non trouvé
 */
router.get(
  '/resultatanneeetudiant/etudiant/:numeroEtudiant/annee/:anneeUniversitaireId',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages', 'mobilites'),
  controller.getByCompositeKey
);

/**
 * @swagger
 * /api/resultatanneeetudiants/etudiant/{numeroEtudiant}/annee/{anneeUniversitaireId}:
 *   get:
 *     summary: Récupérer un résultat annuel spécifique par numéro d'étudiant et année universitaire (route directe)
 *     tags: [ResultatsAnneeEtudiant]
 *     parameters:
 *       - in: path
 *         name: numeroEtudiant
 *         schema:
 *           type: integer
 *         description: Numéro de l'étudiant
 *       - in: path
 *         name: anneeUniversitaireId
 *         schema:
 *           type: integer
 *         description: ID de l'année universitaire
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Résultat trouvé
 *       404:
 *         description: Résultat non trouvé
 */
router.get(
  '/etudiant/:numeroEtudiant/annee/:anneeUniversitaireId',
  controller.getByCompositeKey
);

module.exports = router;
