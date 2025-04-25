const express = require('express');
const router = express.Router();
const controller = require('../controllers/semestres.controller');

/**
 * @swagger
 * tags:
 *   name: Semestres
 *   description: Gestion des semestres
 */

/**
 * @swagger
 * /api/semestres:
 *   get:
 *     summary: Récupère tous les semestres
 *     tags: [Semestres]
 *     responses:
 *       200:
 *         description: Liste des semestres
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/semestres/{id}:
 *   get:
 *     summary: Récupère un semestre par ID
 *     tags: [Semestres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du semestre
 *     responses:
 *       200:
 *         description: Semestre trouvé
 *       404:
 *         description: Semestre non trouvé
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/semestres:
 *   post:
 *     summary: Crée un nouveau semestre
 *     tags: [Semestres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelleSemestre
 *             properties:
 *               libelleSemestre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Semestre créé
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/semestres/{id}:
 *   put:
 *     summary: Met à jour un semestre
 *     tags: [Semestres]
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
 *               libelleSemestre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Semestre mis à jour
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/semestres/{id}:
 *   delete:
 *     summary: Supprime un semestre
 *     tags: [Semestres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Suppression réussie
 */
router.delete('/:id', controller.delete);

module.exports = router;