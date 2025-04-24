const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification

 * /api/auth/login:
 *   post:
 *     summary: Connexion pour obtenir un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Token JWT généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simule un utilisateur connu
  if (email === 'admin@example.com' && password === 'admin123') {
    const token = jwt.sign({ id: 1, role: 'admin', email }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: '1h',
    });

    return res.json({ token });
  }

  res.status(401).json({ message: 'Identifiants invalides' });
});

module.exports = router;
