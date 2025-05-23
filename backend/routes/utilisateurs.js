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
 * /api/utilisateurs/change-password:
 *   post:
 *     summary: Changer le mot de passe de l'utilisateur connecté
 *     description: Permet à l'utilisateur connecté de modifier son mot de passe en fournissant l'ancien et le nouveau mot de passe.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Ancien mot de passe (obligatoire)
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe (obligatoire)
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe changé avec succès
 *       400:
 *         description: Ancien mot de passe incorrect ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ancien mot de passe incorrect
 *       401:
 *         description: Utilisateur non authentifié
 */
router.post('/change-password', authenticateToken,
        checkRole('admin','etudes','mobilites','stages'),controller.changePassword);

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
 *                 enum: [admin, etudes, mobilites, stages]
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
