const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/certificationlangues.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CertificationLangues
 *   description: Gestion des certifications en langue
 */

/**
 * @swagger
 * /api/certificationlangues:
 *   get:
 *     summary: Lister toutes les certifications de langue
 *     tags: [CertificationLangues]
 *     responses:
 *       200:
 *         description: Liste des certifications
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/certificationlangues:
 *   post:
 *     summary: Créer une certification de langue
 *     tags: [CertificationLangues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intituleCertificationLangue
 *             properties:
 *               intituleCertificationLangue:
 *                 type: string
 *                 example: TOEIC
 *     responses:
 *       201:
 *         description: Certification créée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'),
  [body('intituleCertificationLangue').notEmpty().withMessage('Le libellé est requis')],
  controller.create
);

/**
 * @swagger
 * /api/certificationlangues/{id}:
 *   get:
 *     summary: Récupérer une certification par ID
 *     tags: [CertificationLangues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Certification trouvée
 *       404:
 *         description: Certification non trouvée
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/certificationlangues/{id}:
 *   put:
 *     summary: Modifier une certification
 *     tags: [CertificationLangues]
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
 *               libelleCertification:
 *                 type: string
 *     responses:
 *       200:
 *         description: Certification mise à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.update);

/**
 * @swagger
 * /api/certificationlangues/{id}:
 *   delete:
 *     summary: Supprimer une certification
 *     tags: [CertificationLangues]
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
 *         description: Certification supprimée
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'etudes', 'stages/etudes', 'mobilites/etudes', 'stages/mobilites/etudes'), controller.remove);

module.exports = router;
