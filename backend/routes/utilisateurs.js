// routes/utilisateurs.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/utilisateur.controller');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/utilisateurs:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste récupérée
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/utilisateurs/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Non trouvé
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/utilisateurs:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *               - nom
 *               - prenom
 *             properties:
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, gestionnaire, lecteur]
 *     responses:
 *       201:
 *         description: Créé avec succès
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/utilisateurs/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Utilisateurs]
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
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, gestionnaire, lecteur]
 *     responses:
 *       200:
 *         description: Mis à jour avec succès
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/utilisateurs/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé
 */
router.delete('/:id', controller.remove);

module.exports = router;
