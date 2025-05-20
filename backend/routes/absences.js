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
 *               - numeroetudiant
 *               - dateDebutAbsence
 *               - dateFinAbsence
 *               - ecOuActivite
 *               - raisonAbsence
 *               - anneeUniversitaireId
 *             properties:
 *               numeroetudiant:
 *                 type: integer
 *                 description: Numéro de l'étudiant
 *               dateDebutAbsence:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de début de l'absence
 *               dateFinAbsence:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de fin de l'absence
 *               ecOuActivite:
 *                 type: string
 *                 description: EC ou activité concernée par l'absence
 *               raisonAbsence:
 *                 type: string
 *                 description: Raison de l'absence
 *               estjustifiee:
 *                 type: boolean
 *                 description: Indique si l'absence est justifiée
 *                 default: false
 *               anneeUniversitaireId:
 *                 type: integer
 *                 description: ID de l'année universitaire
 *     responses:
 *       201:
 *         description: Absence ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes'),
  [
    body('numeroetudiant').isInt().withMessage('Le numéro étudiant doit être un entier'),
    body('dateDebutAbsence').isISO8601().withMessage('La date de début doit être une date valide'),
    body('dateFinAbsence').isISO8601().withMessage('La date de fin doit être une date valide'),
    body('ecOuActivite').notEmpty().withMessage('L\'EC ou l\'activité est obligatoire'),
    body('raisonAbsence').notEmpty().withMessage('La raison est obligatoire'),
    body('anneeUniversitaireId').isInt().withMessage('L\'année universitaire doit être un entier'),
    body('estjustifiee').isBoolean().optional().withMessage('estjustifiee doit être un booléen')
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
 *         description: ID de l'absence à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroetudiant:
 *                 type: integer
 *                 description: Numéro de l'étudiant
 *               dateDebutAbsence:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de début de l'absence
 *               dateFinAbsence:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de fin de l'absence
 *               ecOuActivite:
 *                 type: string
 *                 description: EC ou activité concernée par l'absence
 *               raisonAbsence:
 *                 type: string
 *                 description: Raison de l'absence
 *               estjustifiee:
 *                 type: boolean
 *                 description: Indique si l'absence est justifiée
 *               anneeUniversitaireId:
 *                 type: integer
 *                 description: ID de l'année universitaire
 *     responses:
 *       200:
 *         description: Absence mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Absence non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', 
  authenticateToken,
  checkRole('admin', 'etudes'), 
  [
    body('numeroetudiant').optional().isInt().withMessage('Le numéro étudiant doit être un entier'),
    body('dateDebutAbsence').optional().isISO8601().withMessage('La date de début doit être une date valide'),
    body('dateFinAbsence').optional().isISO8601().withMessage('La date de fin doit être une date valide'),
    body('ecOuActivite').optional().notEmpty().withMessage('L\'EC ou l\'activité est obligatoire'),
    body('raisonAbsence').optional().notEmpty().withMessage('La raison est obligatoire'),
    body('anneeUniversitaireId').optional().isInt().withMessage('L\'année universitaire doit être un entier'),
    body('estjustifiee').optional().isBoolean().withMessage('estjustifiee doit être un booléen')
  ],
  controller.update
);

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

/**
 * @swagger
 * /api/absences/{id}:
 *   get:
 *     summary: Obtenir une absence par son ID
 *     tags: [Absences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'absence à récupérer
 *     responses:
 *       200:
 *         description: Détails de l'absence
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 numeroetudiant:
 *                   type: integer
 *                 dateDebutAbsence:
 *                   type: string
 *                   format: date-time
 *                 dateFinAbsence:
 *                   type: string
 *                   format: date-time
 *                 ecOuActivite:
 *                   type: string
 *                 raisonAbsence:
 *                   type: string
 *                 estjustifiee:
 *                   type: boolean
 *                 anneeUniversitaireId:
 *                   type: integer
 *                 etudiant:
 *                   type: object
 *                   properties:
 *                     numeroEtudiant:
 *                       type: integer
 *                     nomEtudiant:
 *                       type: string
 *                     prenomEtudiant:
 *                       type: string
 *       404:
 *         description: Absence non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/absences/filter/year:
 *   get:
 *     summary: Lister les absences par année universitaire
 *     tags: [Absences]
 *     parameters:
 *       - in: query
 *         name: anneeUniversitaireId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'année universitaire
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des absences pour l'année universitaire spécifiée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       numeroetudiant:
 *                         type: integer
 *                       dateDebutAbsence:
 *                         type: string
 *                         format: date-time
 *                       dateFinAbsence:
 *                         type: string
 *                         format: date-time
 *                       ecOuActivite:
 *                         type: string
 *                       raisonAbsence:
 *                         type: string
 *                       estjustifiee:
 *                         type: boolean
 *                       etudiant:
 *                         type: object
 *                         properties:
 *                           numeroEtudiant:
 *                             type: integer
 *                           nomEtudiant:
 *                             type: string
 *                           prenomEtudiant:
 *                             type: string
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *       400:
 *         description: ID de l'année universitaire manquant
 *       500:
 *         description: Erreur serveur
 */
router.get('/filter/year', controller.getAllByYear);

module.exports = router;
