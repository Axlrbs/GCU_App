const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const controller = require('../controllers/roles.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Rôles des tuteurs
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Lister tous les rôles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.getAll);


/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtenir un role par ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Introuvable
 */
router.get('/:id', controller.getOne);



module.exports = router;
