// routes/utilisateurs.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/utilisateur.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');

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
router.get('/', authenticateToken,
    checkRole('admin'),controller.getAll);

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
router.get('/:id', authenticateToken,
    checkRole('admin'),controller.getById);

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
 *                 enum: [admin, etudes, mobilites]
 *     responses:
 *       201:
 *         description: Créé avec succès
 */
router.post('/', authenticateToken,
    checkRole('admin'),controller.create);

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
 *                 enum: [admin, etudes, mobilites]
 *     responses:
 *       200:
 *         description: Mis à jour avec succès
 */
router.put('/:id', authenticateToken,
    checkRole('admin'),controller.update);

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
router.delete('/:id', authenticateToken,
    checkRole('admin'),controller.remove);

module.exports = router;
