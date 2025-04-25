// routes/parcoursEtudiantParSemestre.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/parcoursEtudiantParSemestre.controller');

/**
 * @swagger
 * tags:
 *   name: Parcours Étudiant Par Semestre
 *   description: Gestion du parcours des étudiants par semestre
 */

/**
 * @swagger
 * /api/parcoursetudiantparsemestre:
 *   get:
 *     summary: Liste tous les parcours par semestre
 *     tags: [Parcours Étudiant Par Semestre]
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/parcoursetudiantparsemestre/{id}:
 *   get:
 *     summary: Récupère un enregistrement par ID
 *     tags: [Parcours Étudiant Par Semestre]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'enregistrement
 *     responses:
 *       200:
 *         description: Enregistrement trouvé
 *       404:
 *         description: Introuvable
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/parcoursetudiantparsemestre:
 *   post:
 *     summary: Crée une nouvelle liaison étudiant-parcours-semestre
 *     tags: [Parcours Étudiant Par Semestre]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroEtudiant
 *               - parcoursId
 *               - semestreId
 *               - anneeUniversitaireId
 *             properties:
 *               numeroEtudiant:
 *                 type: integer
 *               parcoursId:
 *                 type: integer
 *               semestreId:
 *                 type: integer
 *               anneeUniversitaireId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Enregistrement créé
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/parcoursetudiantparsemestre/{id}:
 *   put:
 *     summary: Met à jour une liaison
 *     tags: [Parcours Étudiant Par Semestre]
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
 *               numeroEtudiant:
 *                 type: integer
 *               parcoursId:
 *                 type: integer
 *               semestreId:
 *                 type: integer
 *               anneeUniversitaireId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Enregistrement mis à jour
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/parcoursetudiantparsemestre/{id}:
 *   delete:
 *     summary: Supprime un enregistrement
 *     tags: [Parcours Étudiant Par Semestre]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID à supprimer
 *     responses:
 *       204:
 *         description: Supprimé avec succès
 */
router.delete('/:id', controller.remove);

module.exports = router;
