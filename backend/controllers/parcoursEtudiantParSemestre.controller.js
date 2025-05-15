const db = require('../models');
const ParcoursEtudiantParSemestre = db.parcoursEtudiantParSemestre;

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await ParcoursEtudiantParSemestre.findAndCountAll({
      include: [
        { model: db.etudiant },
        { model: db.parcours },
        { model: db.semestre },
        { model: db.anneeUniversitaire }
      ],
      limit,
      offset,
      order: [['numeroEtudiant', 'ASC']]
    });

    res.json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * GET /api/parcoursetudiantparsemestre/etudiants
 * Retourne la liste des étudiants avec :
 *  - leurs parcours par semestre (avec le libellé de l'année universitaire),
 *  - leur résultat annuel (avec promotion et code décision),
 * filtrés sur une année universitaire donnée.
 *
 * Query params :
 *   - anneeUniversitaireId (obligatoire)
 */
exports.getStudentsByYear = async (req, res) => {
  try {
    const { anneeUniversitaireId } = req.query;
    if (!anneeUniversitaireId) {
      return res.status(400).json({ message: 'Le paramètre anneeUniversitaireId est requis.' });
    }

    // Récupération des étudiants
    const students = await db.etudiant.findAll({
      include: [
        {
          model: db.parcoursEtudiantParSemestre,
          include: [
            { model: db.parcours },
            { model: db.semestre },
            // Inclure l'année universitaire pour chaque parcours semestriel
            { model: db.anneeUniversitaire }
          ]
        },
        {
          model: db.resultatAnneeEtudiant,
          where: { anneeUniversitaireId },
          include: [
            // Remonter le nom de la promotion
            { model: db.promotion, attributes: ['nomPromotion'] }
          ]
        }
      ],
      order: [['numeroEtudiant', 'ASC']]
    });

    // Aplatir l'objet pour exposer directement la promo et l'année semestrielle
    const data = students.map(item => {
      const plain = item.get({ plain: true });
      const firstParcours = plain.parcoursEtudiantParSemestres[0] || {};
      const resAnnee = plain.resultatAnneeEtudiants[0] || {};
      // Récupération robuste du libellé (handle nom de propriété tronquée)
      const anneeUnivNode = firstParcours.anneeUniversitaire || {};
      const libelle =
        anneeUnivNode.libelleAnneeUniversitaire ??
        anneeUnivNode.libelleAnneeUni ??
        null;
      return {
        ...plain,
        // Assigner le libellé correctement
        libelleAnneeUniversitaire: libelle,
        nomPromotion: resAnnee.promotion?.nomPromotion || null
      };
    });

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ParcoursEtudiantParSemestre.findByPk(req.params.id, {
      include: ['etudiant', 'parcour', 'semestre', 'anneeUniversitaire'],
    });
    if (!item) return res.status(404).json({ message: 'Entrée non trouvée' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await ParcoursEtudiantParSemestre.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await ParcoursEtudiantParSemestre.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedItem = await ParcoursEtudiantParSemestre.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Entrée non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await ParcoursEtudiantParSemestre.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Entrée non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// --- controllers/parcoursEtudiantParSemestre.controller.js ---

// Mise à jour par composite key : (numeroEtudiant, anneeUniversitaireId, semestreId)
exports.updateByCompositeKey = async (req, res) => {
  const { numeroEtudiant, anneeUniversitaireId, semestreId } = req.params;
  
  // Debug log
  console.log('Request body (PUT Parcours):', JSON.stringify(req.body));
  
  try {
    // On cherche directement par numéro Etudiant + année universitaire + semestre
    const record = await ParcoursEtudiantParSemestre.findOne({
      where: { 
        numeroEtudiant: parseInt(numeroEtudiant, 10), 
        anneeUniversitaireId: parseInt(anneeUniversitaireId, 10),
        semestreId: parseInt(semestreId, 10)
      }
    });
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'Parcours introuvable pour cet étudiant/année/semestre' 
      });
    }
    
    // Vérifier que parcoursId est présent car obligatoire
    if (req.body.parcoursId === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Le champ parcoursId est obligatoire'
      });
    }
    
    // Valider et préparer les données à mettre à jour
    const dataToUpdate = {};
    
    // Champ obligatoire: parcoursId
    dataToUpdate.parcoursId = parseInt(req.body.parcoursId, 10);
    
    // Vérifier que la valeur est bien numérique
    if (isNaN(dataToUpdate.parcoursId)) {
      return res.status(400).json({
        success: false,
        message: 'Le parcoursId doit être un nombre valide'
      });
    }
    
    // Afficher l'état avant mise à jour pour debugging
    console.log('AVANT mise à jour - Parcours:', {
      parcoursId: record.parcoursId
    });
    
    // Mise à jour et récupération du résultat
    await record.update(dataToUpdate);
    console.log('APRÈS mise à jour - Parcours:', {
      parcoursId: record.parcoursId
    });
    
    // Récupérer l'enregistrement mis à jour avec les relations
    const updatedRecord = await ParcoursEtudiantParSemestre.findOne({
      where: { 
        numeroEtudiant: parseInt(numeroEtudiant, 10), 
        anneeUniversitaireId: parseInt(anneeUniversitaireId, 10),
        semestreId: parseInt(semestreId, 10)
      },
      include: [
        { model: db.etudiant },
        { model: db.parcours },
        { model: db.semestre },
        { model: db.anneeUniversitaire }
      ]
    });
    
    res.json({
      success: true,
      message: 'Parcours mis à jour avec succès',
      data: updatedRecord
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du parcours:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur', 
      error: err.message
    });
  }
};

/**
 * GET /api/parcoursetudiantparsemestre?numeroEtudiant=X&anneeUniversitaireId=Y&semestreId=Z
 * Récupère le parcours spécifique d'un étudiant pour un semestre et une année donnés
 * via query parameters.
 */
exports.getByCompositeKeyQuery = async (req, res) => {
  try {
    const { numeroEtudiant, anneeUniversitaireId, semestreId } = req.query;
    
    // Vérifier que tous les paramètres requis sont présents
    if (!numeroEtudiant || !anneeUniversitaireId || !semestreId) {
      return res.status(400).json({ 
        success: false,
        message: 'Les paramètres numeroEtudiant, anneeUniversitaireId et semestreId sont requis' 
      });
    }
    
    // Rechercher l'enregistrement correspondant
    const record = await ParcoursEtudiantParSemestre.findOne({
      where: { 
        numeroEtudiant: parseInt(numeroEtudiant, 10), 
        anneeUniversitaireId: parseInt(anneeUniversitaireId, 10), 
        semestreId: parseInt(semestreId, 10) 
      },
      include: [
        { model: db.etudiant },
        { model: db.parcours },
        { model: db.semestre },
        { model: db.anneeUniversitaire }
      ]
    });
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'Parcours introuvable pour cet étudiant/année/semestre' 
      });
    }
    
    return res.json({
      success: true,
      data: record
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du parcours:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: err.message 
    });
  }
};
 
// controllers/parcoursEtudiantParSemestre.controller.js

exports.getAll = async (req, res) => {
  try {
    const page  = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    // Construire le filtre en fonction des query params
    const where = {};
    if (req.query.numeroEtudiant) {
      where.numeroEtudiant = parseInt(req.query.numeroEtudiant, 10);
    }
    if (req.query.anneeUniversitaireId) {
      where.anneeUniversitaireId = parseInt(req.query.anneeUniversitaireId, 10);
    }
    if (req.query.semestreId) {
      where.semestreId = parseInt(req.query.semestreId, 10);
    }

    const { count, rows } = await ParcoursEtudiantParSemestre.findAndCountAll({
      where,
      include: [
        { model: db.etudiant },
        { model: db.parcours },
        { model: db.semestre },
        { model: db.anneeUniversitaire }
      ],
      limit,
      offset,
      order: [['numeroEtudiant', 'ASC']]
    });

    res.json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

