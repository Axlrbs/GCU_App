const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/mobilites.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobilités
 *   description: Gestion des mobilités
 */

/**
 * @swagger
 * /api/mobilites:
 *   get:
 *     summary: Liste de toutes les mobilités
 *     tags: [Mobilités]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/mobilites:
 *   post:
 *     summary: Créer une mobilité
 *     tags: [Mobilités]
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
 *               - typeMobiliteId
 *               - anneeuniversitaireid
 *             properties:
 *               numeroetudiant:
 *                 type: integer
 *               typeMobiliteId:
 *                 type: integer
 *               anneeuniversitaireid:
 *                 type: integer
 *               commentaireMobilite:
 *                 type: string
 *     responses:
 *       201:
 *         description: Créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'mobilites'),
  [
    body('numeroetudiant').isInt(),
    body('typeMobiliteId').isInt(),
    body('anneeuniversitaireid').isInt()
  ],
  controller.create
);

/**
 * @swagger
 * /api/mobilites/{id}:
 *   get:
 *     summary: Obtenir une mobilité par ID
 *     tags: [Mobilités]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mobilité à récupérer
 *     responses:
 *       200:
 *         description: Mobilité trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     mobiliteId:
 *                       type: integer
 *                     numeroetudiant:
 *                       type: integer
 *                     typeMobiliteId:
 *                       type: integer
 *                     anneeuniversitaireid:
 *                       type: integer
 *                     commentaireMobilite:
 *                       type: string
 *                     etudiant:
 *                       type: object
 *                       properties:
 *                         numeroEtudiant:
 *                           type: integer
 *                         nomEtudiant:
 *                           type: string
 *                         prenomEtudiant:
 *                           type: string
 *                     typeMobilite:
 *                       type: object
 *                       properties:
 *                         typeMobiliteId:
 *                           type: integer
 *                         libelleTypeMobilite:
 *                           type: string
 *                     anneeUniversitaire:
 *                       type: object
 *                       properties:
 *                         anneeUniversitaireId:
 *                           type: integer
 *                         libelleAnneeUniversitaire:
 *                           type: string
 *                     etatContratEtude:
 *                       type: object
 *                       properties:
 *                         etatId:
 *                           type: integer
 *                         libelleEtat:
 *                           type: string
 *                     etatReleveNote:
 *                       type: object
 *                       properties:
 *                         etatId:
 *                           type: integer
 *                         libelleEtat:
 *                           type: string
 *                     etablissement:
 *                       type: object
 *                       properties:
 *                         etablissementId:
 *                           type: integer
 *                         nomEtablissement:
 *                           type: string
 *                         ville:
 *                           type: object
 *                           properties:
 *                             villeId:
 *                               type: integer
 *                             nomVille:
 *                               type: string
 *                             pays:
 *                               type: object
 *                               properties:
 *                                 paysId:
 *                                   type: integer
 *                                 nomPays:
 *                                   type: string
 *       404:
 *         description: Mobilité non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/mobilites/{id}:
 *   put:
 *     summary: Modifier une mobilité
 *     tags: [Mobilités]
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
 *               commentaireMobilite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Modifiée
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'mobilites'), controller.update);

/**
 * @swagger
 * /api/mobilites/{id}:
 *   delete:
 *     summary: Supprimer une mobilité
 *     tags: [Mobilités]
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
 *         description: Supprimée
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'mobilites'), controller.remove);

module.exports = router;
