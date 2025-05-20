// routes/parcoursEtudiantParSemestre.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/parcoursEtudiantParSemestre.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');


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
 *     summary: Liste tous les parcours par semestre (si sans paramètre) ou récupère un parcours spécifique (avec paramètres)
 *     tags: [Parcours Étudiant Par Semestre]
 *     parameters:
 *       - in: query
 *         name: numeroEtudiant
 *         schema:
 *           type: integer
 *         description: Numéro de l'étudiant
 *       - in: query
 *         name: anneeUniversitaireId
 *         schema:
 *           type: integer
 *         description: ID de l'année universitaire
 *       - in: query
 *         name: semestreId
 *         schema:
 *           type: integer
 *         description: ID du semestre
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès ou parcours spécifique trouvé
 *       404:
 *         description: Parcours introuvable avec les paramètres spécifiés
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/parcoursetudiantparsemestre/etudiants:
 *   get:
 *     tags:
 *       - ParcoursEtudiantParSemestre
 *     summary: Liste les étudiants avec leurs parcours et résultats annuels
 *     description: >
 *       Renvoie la liste des étudiants, incluant :
 *         - leurs parcours par semestre (Jointure sur ParcoursEtudiantParSemestre → Parcours, Semestre)
 *         - leur résultat annuel (Jointure sur ResultatAnneeEtudiant pour récupérer promotionId et codeDecision)
 *       Filtrage sur l'année universitaire via `anneeUniversitaireId`.
 *     parameters:
 *       - in: query
 *         name: anneeUniversitaireId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'année universitaire à filtrer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page (pagination)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Nombre d'éléments par page (max 100)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès – objet contenant le nombre total et la liste des étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EtudiantWithParcoursResult'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get(
    '/etudiants',
    authenticateToken,
    checkRole('admin', 'etudes','stages','mobilites'),
    controller.getStudentsByYear
);

/**
 * @swagger
 * /api/parcoursetudiantparsemestre/etudiants/liste:
 *   get:
 *     summary: Liste à plat des parcours étudiants par semestre
 *     description: >
 *       Retourne une liste à plat des parcours étudiants par semestre,
 *       triée par année universitaire décroissante puis par semestre.
 *     tags: [Parcours Étudiant Par Semestre]
 *     responses:
 *       200:
 *         description: Liste des parcours étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       parcoursetudiantid:
 *                         type: integer
 *                       numeroEtudiant:
 *                         type: integer
 *                       nomEtudiant:
 *                         type: string
 *                       prenomEtudiant:
 *                         type: string
 *                       parcoursId:
 *                         type: integer
 *                       libelleParcours:
 *                         type: string
 *                       semestreId:
 *                         type: integer
 *                       libelleSemestre:
 *                         type: string
 *                       anneeUniversitaireId:
 *                         type: integer
 *                       libelleAnneeUniversitaire:
 *                         type: string
 */
router.get(
  '/etudiants/liste',
  controller.getStudents
);

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
router.post('/', authenticateToken,
    checkRole('admin', 'etudes'),controller.create);

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
router.put('/:id', authenticateToken,
    checkRole('admin', 'etudes'),controller.update);

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
router.delete('/:id',authenticateToken,
    checkRole('admin', 'etudes'), controller.remove);

// --- routes/parcoursEtudiantParSemestre.js ---
/**
 * @swagger
 * /api/parcoursetudiantparsemestre/etudiant/{numeroEtudiant}/annee/{anneeUniversitaireId}/semestre/{semestreId}:
 *   put:
 *     summary: Met à jour le parcours d'un étudiant pour un semestre donné
 *     tags: [Parcours Étudiant Par Semestre]
 *     parameters:
 *       - in: path
 *         name: numeroEtudiant
 *         schema: { type: integer }
 *         required: true
 *       - in: path
 *         name: anneeUniversitaireId
 *         schema: { type: integer }
 *         required: true
 *       - in: path
 *         name: semestreId
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parcoursId
 *             properties:
 *               parcoursId:
 *                 type: integer
 *                 description: ID du parcours (obligatoire)
 *     responses:
 *       200:
 *         description: Parcours mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Parcours mis à jour avec succès"
 *                 data:
 *                   type: object
 *       400:
 *         description: Requête invalide (parcoursId manquant ou invalide)
 *       404:
 *         description: Parcours introuvable pour cet étudiant/année/semestre
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/etudiant/:numeroEtudiant/annee/:anneeUniversitaireId/semestre/:semestreId',
    authenticateToken,
    checkRole('admin', 'etudes'),
    controller.updateByCompositeKey
  );
  

module.exports = router;
