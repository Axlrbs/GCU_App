const db = require('../models');
const { validationResult } = require('express-validator');

const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100
    const offset = (page - 1) * limit;

    const naturePartenariatId = req.query.naturePartenariatId ? parseInt(req.query.naturePartenariatId) : null;
     const partenaireId = req.query.partenaireId
      ? parseInt(req.query.partenaireId)
      : null;   
    const annee = req.query.annee;
    const mois = req.query.mois;

    const whereConditions = {};
    if (naturePartenariatId) {
      whereConditions.naturePartenariatId = naturePartenariatId;
    }
     if (partenaireId) {
      whereConditions.partenaireId = partenaireId; // ← ajout
    }
    const search = req.query.search || '';

    if (search) {
      whereConditions[Op.or] = [
        { '$etudiant.nomEtudiant$': { [Op.like]: `%${search}%` } },
        { '$etudiant.prenomEtudiant$': { [Op.like]: `%${search}%` } }
      ];
    }
    if (annee && mois) {
      const debut = `${annee}-${mois.padStart(2, "0")}-01`;
      const finDate = new Date(annee, mois, 0); // 0 = dernier jour du mois précédent donc donne le bon mois
      const fin = finDate.toISOString().slice(0, 10);
      whereConditions.dateActivite = { [Op.between]: [debut, fin] };
    } else if (annee) {
      const debut = `${annee}-01-01`;
      const fin = `${annee}-12-31`;
      whereConditions.dateActivite = { [Op.between]: [debut, fin] };
    }

    const estdiplome = req.query.estdiplome;
    if (estdiplome !== undefined) {
      whereConditions['$etudiant.estdiplome$'] = estdiplome === 'true';
    }

    const { count, rows } = await db.etudiantParticipePartenariat.findAndCountAll({
      where: (Object.keys(whereConditions).length > 0 || Object.getOwnPropertySymbols(whereConditions).length > 0)? whereConditions : undefined,
      include: [
        { 
          model: db.etudiant,
          attributes: ['numeroEtudiant', 'nomEtudiant', 'prenomEtudiant', 'mailEtudiant', 'estdiplome']
        },
        { 
          model: db.partenaire,
          attributes: ['partenaireId', 'nomPartenaire', 'secteurPartenaire']
        },
        { 
          model: db.naturePartenariat,
          attributes: ['naturePartenariatId', 'libelleNaturePartenariat']
        }
      ],
      limit,
      offset,
      order: [
        [{ model: db.etudiant, as: 'etudiant' }, 'nomEtudiant', 'ASC'],
        ['dateActivite', 'DESC']
      ]
    });

    res.json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });
  } catch (error) {
    console.error('Erreur dans getAll:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: error.message,
      details: error.original?.message || null
    });
  }
};

exports.getWithoutEtudiant = async (req, res) => {
  try {
    const participations = await db.etudiantParticipePartenariat.findAll({
      where: {
        numeroEtudiant: null
      },
      include: [
        { model: db.partenaire },
        { model: db.naturePartenariat }
      ]
    });
    res.json({ success: true, data: participations });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getAllWithoutPagi = async (req, res) => {
  try {
    const naturePartenariatId = req.query.naturePartenariatId ? parseInt(req.query.naturePartenariatId) : null;
     const partenaireId = req.query.partenaireId
      ? parseInt(req.query.partenaireId)
      : null;   
    const annee = req.query.annee;
    const mois = req.query.mois;

    const whereConditions = {};
    if (naturePartenariatId) {
      whereConditions.naturePartenariatId = naturePartenariatId;
    }
     if (partenaireId) {
      whereConditions.partenaireId = partenaireId; // ← ajout
    }
    const search = req.query.search || '';

    if (search) {
      whereConditions[Op.or] = [
        { '$etudiant.nomEtudiant$': { [Op.like]: `%${search}%` } },
        { '$etudiant.prenomEtudiant$': { [Op.like]: `%${search}%` } }
      ];
    }
    if (annee && mois) {
      const debut = `${annee}-${mois.padStart(2, "0")}-01`;
      const finDate = new Date(annee, mois, 0); // 0 = dernier jour du mois précédent donc donne le bon mois
      const fin = finDate.toISOString().slice(0, 10);
      whereConditions.dateActivite = { [Op.between]: [debut, fin] };
    } else if (annee) {
      const debut = `${annee}-01-01`;
      const fin = `${annee}-12-31`;
      whereConditions.dateActivite = { [Op.between]: [debut, fin] };
    }

    const estdiplome = req.query.estdiplome;
    if (estdiplome !== undefined) {
      whereConditions['$etudiant.estdiplome$'] = estdiplome === 'true';
    }

    const { count, rows } = await db.etudiantParticipePartenariat.findAndCountAll({
      where: (Object.keys(whereConditions).length > 0 || Object.getOwnPropertySymbols(whereConditions).length > 0)? whereConditions : undefined,
      include: [
        { 
          model: db.etudiant,
          attributes: ['numeroEtudiant', 'nomEtudiant', 'prenomEtudiant', 'mailEtudiant', 'estdiplome']
        },
        { 
          model: db.partenaire,
          attributes: ['partenaireId', 'nomPartenaire', 'secteurPartenaire']
        },
        { 
          model: db.naturePartenariat,
          attributes: ['naturePartenariatId', 'libelleNaturePartenariat']
        }
      ],
      order: [
        [{ model: db.etudiant, as: 'etudiant' }, 'nomEtudiant', 'ASC'],
        ['dateActivite', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Erreur dans getAll:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: error.message,
      details: error.original?.message || null
    });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }
  try {
    const newParticipation = await db.etudiantParticipePartenariat.create(req.body);
    res.status(201).json(newParticipation);
  } catch (err) {
    console.error('Erreur create participation:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const participation = await db.etudiantParticipePartenariat.findByPk(req.params.id);
    if (!participation) return res.status(404).json({ message: 'participation non trouvée' });

    const { numeroEtudiant, ...autresChamps } = req.body;

    // si on a reçu un tableau => multi‐affectation
    if (Array.isArray(numeroEtudiant)) {
      // supprime l'ancienne entrée
      await participation.destroy();
      // recrée une ligne par étudiant sélectionné
      const creations = numeroEtudiant.map(num => 
        db.etudiantParticipePartenariat.create({
          numeroEtudiant: num,
          ...autresChamps
        })
      );
      await Promise.all(creations);
      return res.json({ message: 'Jeton assigné à plusieurs étudiants.' });
    }

    // sinon cas simple (1 étudiant)
    await participation.update({ numeroEtudiant, ...autresChamps });
    res.json(participation);
    
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const participation = await db.etudiantParticipePartenariat.findByPk(req.params.id);
    if (!participation) return res.status(404).json({ message: 'Participation non trouvée' });

    await participation.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const participation = await db.etudiantParticipePartenariat.findByPk(
      req.params.id,
      {
        include: [
          { model: db.etudiant },
          { model: db.partenaire },
          { model: db.naturePartenariat }
        ]
      }
    );
    if (!participation) {
      return res.status(404).json({ message: 'Participation non trouvée' });
    }
    res.json(participation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};