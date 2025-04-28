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


module.exports = router;