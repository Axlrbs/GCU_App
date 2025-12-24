const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/etudiantParticipePartenariats.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


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
router.get('/', 
  authenticateToken,
  checkRole('admin', 'etudes', 'mobilites', 'stages', 'stages/mobilites', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  controller.getAll);

/**
 * @swagger
 * /api/etudiantparticipepartenariats/sans-pagination:
 *   get:
 *     summary: Lister toutes les participations sans pagination
 *     tags: [EtudiantParticipePartenariat]
 *     responses:
 *       200:
 *         description: Liste des participations
 */
router.get('/sans-pagination', 
  authenticateToken,
  checkRole('admin', 'etudes', 'mobilites', 'stages', 'stages/mobilites', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  controller.getAllWithoutPagi
);

/**
 * @swagger
 * /api/etudiantparticipepartenariats/sans-etudiant:
 *   get:
 *     summary: Lister toutes les participations sans numeroEtudiant
 *     tags: [EtudiantParticipePartenariat]
 *     responses:
 *       200:
 *         description: Liste des participations
 */
router.get('/sans-etudiant', 
  authenticateToken,
  checkRole('admin', 'etudes', 'mobilites', 'stages', 'stages/mobilites', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  controller.getWithoutEtudiant);

/**
 * @swagger
 * /api/etudiantparticipepartenariats/{id}:
 *   get:
 *     summary: Lister toutes les participations
 *     tags: [EtudiantParticipePartenariat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des participations
 */
router.get('/:id',
  authenticateToken,
  checkRole('admin', 'etudes', 'mobilites', 'stages', 'stages/mobilites', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  controller.findOne);




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
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  [
    body('partenaireId').isInt(),
    body('naturePartenariatId').isInt(),
    body('dateActivite').notEmpty(),
  ],
  controller.create
);


/**
 * @swagger
 * /api/etudiantparticipepartenariats/{id}:
 *   put:
 *     summary: Modifier une participation
 *     tags: [EtudiantParticipePartenariat]
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
 *             required:
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
router.put(
  '/:id',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  [
    body('partenaireId').isInt(),
    body('naturePartenariatId').isInt(),
    body('dateActivite').notEmpty(),
  ],
  controller.update
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
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
