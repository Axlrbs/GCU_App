const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/typemobilites.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TypeMobilites
 *   description: Gestion des types de mobilité
 */

/**
 * @swagger
 * /api/typemobilites:
 *   get:
 *     summary: Lister tous les types de mobilité
 *     tags: [TypeMobilites]
 *     responses:
 *       200:
 *         description: Liste des types de mobilité
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/typemobilites:
 *   post:
 *     summary: Créer un type de mobilité
 *     tags: [TypeMobilites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelleTypeMobilite
 *             properties:
 *               libelleTypeMobilite:
 *                 type: string
 *                 example: Mobilité Stage
 *     responses:
 *       201:
 *         description: Type de mobilité créé
 */
router.post(
  '/',
  authenticateToken,
  checkRole('admin', 'mobilites'),
  [body('libelleTypeMobilite').notEmpty().withMessage('Le libellé est requis')],
  controller.create
);

/**
 * @swagger
 * /api/typemobilites/{id}:
 *   get:
 *     summary: Récupérer un type de mobilité
 *     tags: [TypeMobilites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Type trouvé
 *       404:
 *         description: Type non trouvé
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/typemobilites/{id}:
 *   put:
 *     summary: Modifier un type de mobilité
 *     tags: [TypeMobilites]
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
 *               libelleTypeMobilite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Type mis à jour
 */
router.put('/:id', authenticateToken,
  checkRole('admin', 'mobilites'), controller.update);

/**
 * @swagger
 * /api/typemobilites/{id}:
 *   delete:
 *     summary: Supprimer un type de mobilité
 *     tags: [TypeMobilites]
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
 *         description: Type supprimé
 */
router.delete('/:id', authenticateToken,
  checkRole('admin', 'mobilites'), controller.remove);

module.exports = router;
