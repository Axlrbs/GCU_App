// controllers/parcoursEtudiantParSemestre.controller.js
const db                        = require('../models');
const ParcoursSemestre          = db.parcoursEtudiantParSemestre;
const ResultatAnnuel            = db.resultatAnneeEtudiant;
const Etudiant                  = db.etudiant;
const Parcours                  = db.parcours;
const Semestre                  = db.semestre;
const AnneeUniv                 = db.anneeUniversitaire;
const Promotion                 = db.promotion;

exports.getAll = async (req, res) => {
  try {
    // 1) Construction dynamique du filtre pour ParcoursSemestre
    const whereParcours = {};
    if (req.query.numeroEtudiant !== undefined) {
      const n = parseInt(req.query.numeroEtudiant, 10);
      if (isNaN(n)) return res.status(400).json({ message: 'numeroEtudiant invalide' });
      whereParcours.numeroEtudiant = n;
    }
    if (req.query.anneeUniversitaireId !== undefined) {
      const a = parseInt(req.query.anneeUniversitaireId, 10);
      if (isNaN(a)) return res.status(400).json({ message: 'anneeUniversitaireId invalide' });
      whereParcours.anneeUniversitaireId = a;
    }
    if (req.query.semestreId !== undefined) {
      const s = parseInt(req.query.semestreId, 10);
      if (isNaN(s)) return res.status(400).json({ message: 'semestreId invalide' });
      whereParcours.semestreId = s;
    }

    // 2) On récupère les semestres selon ces filtres
    const parcours = await ParcoursSemestre.findAll({
      where: whereParcours,
      include: [
        { model: Etudiant,  attributes: ['numeroEtudiant','nomEtudiant','prenomEtudiant'] },
        { model: Parcours,  as: 'parcour', attributes: ['nomParcours'], required: false },
        { model: Semestre,  attributes: ['semestreId','libelleSemestre'] },
        { model: AnneeUniv, attributes: ['anneeUniversitaireId','libelleAnneeUniversitaire'] }
      ],
      order: [
        ['anneeUniversitaireId','DESC'],
        ['semestreId',         'ASC']
      ]
    });

    // 3) On charge les promotions uniquement pour l'année si demandée
    const whereResult = {};
    if (whereParcours.numeroEtudiant !== undefined) {
      whereResult.numeroEtudiant = whereParcours.numeroEtudiant;
    }
    if (whereParcours.anneeUniversitaireId !== undefined) {
      whereResult.anneeUniversitaireId = whereParcours.anneeUniversitaireId;
    }
    const resultats = await ResultatAnnuel.findAll({
      where: whereResult,
      include: [
        { model: Promotion, attributes: ['nomPromotion'] },
        { model: AnneeUniv, attributes: ['anneeUniversitaireId'] }
      ]
    });
    const promoMap = new Map(resultats.map(r => [
      `${r.numeroEtudiant}-${r.anneeUniversitaireId}`,
      r.promotion?.nomPromotion || null
    ]));

    // 4) Pivot JS : 1 ligne par (étudiant + année), on remplit S1/S2
    const map = new Map();
    parcours.forEach(r => {
      const etu    = r.etudiant;
      const idAn   = r.anneeUniversitaire.anneeUniversitaireId;
      const libAn  = r.anneeUniversitaire.libelleAnneeUniversitaire;
      const key    = `${etu.numeroEtudiant}-${idAn}`;
      const promo  = promoMap.get(key) || null;
      const semId  = r.semestre.semestreId;
      const nomPar = r.parcour?.nomParcours || null;

      if (!map.has(key)) {
        map.set(key, {
          numeroEtudiant: etu.numeroEtudiant,
          nom:            etu.nomEtudiant,
          prenom:         etu.prenomEtudiant,
          annee:          libAn,
          anneeUniversitaireId: idAn,
          promotion:      promo,
          parcoursS1:     null,
          semestreS1Id:   null,
          parcoursS2:     null,
          semestreS2Id:   null
        });
      }
      const ligne = map.get(key);
      if (semId === 1) {
        ligne.parcoursS1   = nomPar;
        ligne.semestreS1Id = semId;
      }
      if (semId === 2) {
        ligne.parcoursS2   = nomPar;
        ligne.semestreS2Id = semId;
      }
    });

    // 5) On renvoie le JSON
    return res.json({
      success:    true,
      totalItems: map.size,
      data:       Array.from(map.values())
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
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
    const item = await ParcoursSemestre.findByPk(req.params.id, {
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
    const newItem = await ParcoursSemestre.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await ParcoursSemestre.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedItem = await ParcoursSemestre.findByPk(req.params.id);
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
    const deleted = await ParcoursSemestre.destroy({ where: { id: req.params.id } });
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
    const record = await ParcoursSemestre.findOne({
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
    const updatedRecord = await ParcoursSemestre.findOne({
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
 

/**
 * GET /api/parcoursetudiantparsemestre/etudiants/liste
 * Retourne une liste à plat des parcours étudiants par semestre
 * Inclut les résultats annuels (promotion et décision) pour chaque année
 * Triée par année universitaire décroissante puis par semestre
 */
exports.getStudents = async (req, res) => {
  try {
    // Récupérer tous les parcours avec leurs relations
    const parcours = await db.parcoursEtudiantParSemestre.findAll({
      include: [
        { 
          model: db.etudiant,
          attributes: ['numeroEtudiant', 'nomEtudiant', 'prenomEtudiant']
        },
        { 
          model: db.parcours,
          attributes: ['parcoursId', 'libelleParcours']
        },
        { 
          model: db.semestre,
          attributes: ['semestreId', 'libelleSemestre']
        },
        { 
          model: db.anneeUniversitaire,
          attributes: ['anneeUniversitaireId', 'libelleAnneeUniversitaire']
        }
      ],
      order: [
        [{ model: db.anneeUniversitaire }, 'libelleAnneeUniversitaire', 'DESC'],
        [{ model: db.semestre }, 'libelleSemestre', 'ASC']
      ]
    });

    // Récupérer tous les résultats annuels avec leurs promotions et décisions
    const resultatsAnnuels = await db.resultatAnneeEtudiant.findAll({
      include: [
        {
          model: db.promotion,
          attributes: ['nomPromotion']
        },
        {
          model: db.decisionJurys,
          attributes: ['libelleDecision']
        }
      ]
    });

    // Créer un map pour accéder rapidement aux résultats annuels
    const resultatsMap = new Map();
    resultatsAnnuels.forEach(resultat => {
      const key = `${resultat.numeroEtudiant}-${resultat.anneeUniversitaireId}`;
      resultatsMap.set(key, {
        nomPromotion: resultat.promotion?.nomPromotion || null,
        codeDecision: resultat.codeDecision || null,
        libelleDecision: resultat.decisionJury?.libelleDecision || null
      });
    });

    // Transformer les données pour avoir une structure à plat
    const flattenedData = parcours.map(item => {
      const key = `${item.numeroEtudiant}-${item.anneeUniversitaire.anneeUniversitaireId}`;
      const resultat = resultatsMap.get(key) || {};
      
      return {
        parcoursetudiantid: item.parcoursetudiantid,
        numeroEtudiant: item.etudiant.numeroEtudiant,
        nomEtudiant: item.etudiant.nomEtudiant,
        prenomEtudiant: item.etudiant.prenomEtudiant,
        parcoursId: item.parcours?.parcoursId,
        libelleParcours: item.parcours?.libelleParcours,
        semestreId: item.semestre.semestreId,
        libelleSemestre: item.semestre.libelleSemestre,
        anneeUniversitaireId: item.anneeUniversitaire.anneeUniversitaireId,
        libelleAnneeUniversitaire: item.anneeUniversitaire.libelleAnneeUniversitaire,
        // Ajout des informations de promotion et décision
        nomPromotion: resultat.nomPromotion,
        codeDecision: resultat.codeDecision,
        libelleDecision: resultat.libelleDecision
      };
    });

    // Appliquer les filtres si présents dans la requête
    let filteredData = flattenedData;
    if (req.query.anneeUniversitaireId) {
      filteredData = filteredData.filter(item => 
        item.anneeUniversitaireId === parseInt(req.query.anneeUniversitaireId)
      );
    }
    if (req.query.promotionId) {
      filteredData = filteredData.filter(item => 
        item.promotionId === parseInt(req.query.promotionId)
      );
    }

    res.json({
      success: true,
      count: filteredData.length,
      data: filteredData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des parcours étudiants:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

