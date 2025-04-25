const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/etudiantpassecertifications.controller');

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
 *               - dateObtention
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               certificationLangueId:
 *                 type: integer
 *               dateObtention:
 *                 type: string
 *                 format: date
 *               score:
 *                 type: integer
 *               niveauObtenu:
 *                 type: string
 *     responses:
 *       201:
 *         description: Certification enregistrée
 */
router.post(
  '/',
  verifyToken,
  [
    body('numeroEtudiant').isInt(),
    body('certificationLangueId').isInt(),
    body('dateObtention').notEmpty()
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
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;
