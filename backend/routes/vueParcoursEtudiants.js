const express = require('express');
const router = express.Router();
const vueParcoursCtrl = require('../controllers/vueParcoursEtudiants.controller');

/**
 * @swagger
 * tags:
 *   name: VueParcoursEtudiants
 *   description: Visualisation des parcours étudiants
 */

/**
 * @swagger
 * /api/vueparcoursetudiants:
 *   get:
 *     summary: Liste des parcours étudiants
 *     tags: [VueParcoursEtudiants]
 *     responses:
 *       200:
 *         description: Liste des parcours étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   etudiantId:
 *                     type: integer
 *                     example: 1
 *                   nom:
 *                     type: string
 *                     example: "Durand"
 *                   prenom:
 *                     type: string
 *                     example: "Claire"
 *                   formation:
 *                     type: string
 *                     example: "Master Génie Civil"
 *                   annee:
 *                     type: string
 *                     example: "2024"
 */

router.get('/', vueParcoursCtrl.getAll);

module.exports = router;
