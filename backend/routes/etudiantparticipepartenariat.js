const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/etudiantParticipePartenariats.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EtudiantParticipePartenariat
 *   description: Participation des étudiants à des partenariats
 */

/**
 * @swagger
 * /api/etudiantparticipepartenariats:
 *   get:
 *     summary: Lister toutes les participations
 *     tags: [EtudiantParticipePartenariat]
 *     responses:
 *       200:
 *         description: Liste des participations
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/etudiantparticipepartenariats:
 *   post:
 *     summary: Ajouter une participation
 *     tags: [EtudiantParticipePartenariat]
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
 *               - partenaireId
 *               - naturePartenariatId
 *               - dateActivite
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               partenaireId:
 *                 type: integer
 *               naturePartenariatId:
 *                 type: integer
 *               dateActivite:
 *                 type: string
 *                 format: date
 *               commentaireActivite:
 *                 type: string
 *               nbreJetonsAttribues:
 *                 type: integer
 *               aParticipe:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Participation enregistrée
 */
router.post(
  '/',
  verifyToken,
  [
    body('numeroEtudiant').isInt(),
    body('partenaireId').isInt(),
    body('naturePartenariatId').isInt(),
    body('dateActivite').notEmpty(),
  ],
  controller.create
);

/**
 * @swagger
 * /api/etudiantparticipepartenariats/{id}:
 *   delete:
 *     summary: Supprimer une participation
 *     tags: [EtudiantParticipePartenariat]
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
 *         description: Participation supprimée
 */
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;
