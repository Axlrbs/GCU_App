const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/etudiantpassecertifications.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EtudiantPasseCertifications
 *   description: Gestion des certifications passées par les étudiants
 */

/**
 * @swagger
 * /api/etudiantpassecertifications:
 *   get:
 *     summary: Lister toutes les certifications passées
 *     tags: [EtudiantPasseCertifications]
 *     responses:
 *       200:
 *         description: Liste des certifications passées
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/etudiantpassecertifications:
 *   post:
 *     summary: Enregistrer une certification passée par un étudiant
 *     tags: [EtudiantPasseCertifications]
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
 *               - certificationLangueId
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               certificationLangueId:
 *                 type: integer
 *               score:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Certification enregistrée
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'etudes'),
  [
    body('numeroEtudiant').isInt(),
    body('certificationLangueId').isInt()
  ],
  controller.create
);

/**
 * @swagger
 * /api/etudiantpassecertifications/{id}:
 *   delete:
 *     summary: Supprimer une certification passée
 *     tags: [EtudiantPasseCertifications]
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
  checkRole('admin', 'etudes'), controller.remove);

/**
 * @swagger
 * /api/etudiantpassecertifications/{id}:
 *   put:
 *     summary: Mettre à jour une certification passée par un étudiant
 *     tags: [EtudiantPasseCertifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la certification à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroEtudiant
 *               - certificationLangueId
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *                 description: Numéro de l'étudiant
 *               certificationLangueId:
 *                 type: integer
 *                 description: ID de la certification de langue
 *               score:
 *                 type: integer
 *                 description: Score obtenu à la certification
 *     responses:
 *       200:
 *         description: Certification mise à jour avec succès
 *       404:
 *         description: Certification non trouvée
 */
router.put(
  '/:id',
  authenticateToken,
  checkRole('admin', 'etudes'),
  [
    body('numeroEtudiant').isInt(),
    body('certificationLangueId').isInt()
  ],
  controller.update
);

module.exports = router;
