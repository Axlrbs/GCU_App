const db = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const anneeUniversitaire = req.query.anneeUniversitaire || null;

    // Construire les conditions de recherche
    let whereConditions = {};
    
    // Ajouter la recherche
    if (search) {
      whereConditions = {
        [Op.or]: [
          { '$etudiant.nomEtudiant$': { [Op.like]: `%${search}%` } },
          { '$etudiant.prenomEtudiant$': { [Op.like]: `%${search}%` } },
          { numeroEtudiant: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // Ajouter le filtre d'année universitaire si spécifié
    if (anneeUniversitaire) {
      whereConditions['$anneeUniversitaire.libelleAnneeUniversitaire$'] = anneeUniversitaire;
    }

    const { count, rows } = await db.resultatAnneeEtudiant.findAndCountAll({
      where: whereConditions,
      include: [
        { model: db.etudiant, as: 'etudiant' },
        { model: db.promotion, as: 'promotion' },
        { model: db.anneeUniversitaire, as: 'anneeUniversitaire' },
        { model: db.decisionJurys, as: 'decisionJury' }
      ],
      limit,
      offset,
      order: [['numeroEtudiant', 'ASC']],
      distinct: true // Pour obtenir un count correct avec les jointures
    });
    
    res.json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });

  } catch (err) {
    console.error("Erreur API:", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getHistoryByStudent = async (req, res) => {
  const { numeroEtudiant } = req.query;
  if (!numeroEtudiant) {
    return res
      .status(400)
      .json({ success: false, message: 'Le paramètre numeroEtudiant est requis.' });
  }

  try {
    const history = await db.resultatAnneeEtudiant.findAll({
      where: { numeroEtudiant },
      include: [
        {
          model: db.anneeUniversitaire,
          attributes: ['anneeUniversitaireId', 'libelleAnneeUniversitaire']   // nommez bien votre champ label si différent
        },
        {
          model: db.promotion,
          attributes: ['promotionId', 'nomPromotion']   // idem pour le libellé de la promotion
        }
      ],
      order: [['anneeUniversitaireId', 'ASC']]
    });

    res.json({ success: true, data: history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};


exports.getOne = async (req, res) => {
  try {
    const resultat = await db.resultatAnneeEtudiant.findByPk(req.params.id, {
      include: ['etudiant', 'promotion', 'anneeUniversitaire', 'decisionJury']
    });
    if (!resultat) return res.status(404).json({ message: 'Résultat non trouvé' });

    res.json(resultat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  try {
    const newResultat = await db.resultatAnneeEtudiant.create(req.body);
    res.status(201).json(newResultat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const resultat = await db.resultatAnneeEtudiant.findByPk(req.params.id);
    if (!resultat) return res.status(404).json({ message: 'Résultat non trouvé' });

    await resultat.update(req.body);
    res.json(resultat);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const resultat = await db.resultatAnneeEtudiant.findByPk(req.params.id);
    if (!resultat) return res.status(404).json({ message: 'Résultat non trouvé' });

    await resultat.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};