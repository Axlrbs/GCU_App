const db = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    console.log('req.query:', req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100
    const offset = (page - 1) * limit;

    const search = req.query.search || '';
    const sexe = req.query.sexe;
    const cursusId = req.query.cursusId ? parseInt(req.query.cursusId) : null;
    const statutetudiantid = req.query.statutetudiantid ? parseInt(req.query.statutetudiantid) : null;
    const estdiplome = req.query.estdiplome === 'true' ? true : 
                      req.query.estdiplome === 'false' ? false : 
                      null;

    const whereConditions = {};
    
    // Ajout de la condition de recherche par nom/prénom
    if (search) {
      whereConditions[Op.or] = [
        { nomEtudiant: { [Op.iLike]: `%${search}%` } },
        { prenomEtudiant: { [Op.iLike]: `%${search}%` } },
        { mailEtudiant: { [Op.iLike]: `%${search}%` } },
        !isNaN(search) ? { numeroEtudiant: parseInt(search) } : null
      ].filter(Boolean);
    }
    //console.log('whereConditions keys:', Object.getOwnPropertySymbols(whereConditions));
    //console.dir(whereConditions, { depth: null });
    // Ajout des filtres supplémentaires
    if (sexe) {
      whereConditions.sexe = { [db.Sequelize.Op.iLike]: sexe };
    }
    if (cursusId) {
      whereConditions.cursusId = cursusId;
    }
    if (statutetudiantid) {
      whereConditions.statutetudiantid = statutetudiantid;
    }
    if (estdiplome !== null) {
      whereConditions.estdiplome = estdiplome;
    }
    /*console.log('whereConditions (dir):');
    console.dir(whereConditions, { depth: null });
    console.log('SYMBOLS:', Object.getOwnPropertySymbols(whereConditions));
    console.log('whereConditions:', JSON.stringify(whereConditions, null, 2));*/

    const result = await db.etudiant.findAll({
      where: {
        nomEtudiant: { [Op.iLike]: '%ABADIE%' }
      }
    });
    //console.log('Résultat test direct:', result);

    const { count, rows } = await db.etudiant.findAndCountAll({
      where: (Object.keys(whereConditions).length > 0 || Object.getOwnPropertySymbols(whereConditions).length > 0) ? whereConditions : undefined,
      distinct: true,
      include: [
        { model: db.formation,
            include: [
              {
                model: db.etablissementorigineformation,
                as: 'etablissementorigineformations',
                include: [
                  { model: db.etablissement, as: 'etablissement' }
                ]
              }
            ]
          },    
        { model: db.cursus },
        { model: db.statutetudiant },
        { model: db.etablissement }
      ],
      limit,
      offset,
      order: [['nomEtudiant', 'ASC']]
    });


    /*const result = await db.etudiant.findAll({
      where: {
        nomEtudiant: { [db.Sequelize.Op.iLike]: '%abadie%' }
      }
    });
    console.log(result);*/
    res.json({
      success: true,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.create = async (req, res) => {
  try{
  console.log('Reçu :', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }
  console.log('Données reçues pour create:', req.body);
  const newEtu = await db.etudiant.create(req.body);
  res.status(201).json(newEtu);
} catch (err) {
  // LOG DETAILLE
  if (err.parent && err.parent.code === '23505') {
    // 23505 = duplicate key value violates unique constraint
    return res.status(409).json({
      message: "Un étudiant avec ce numéro existe déjà."
    });
  }
  res.status(500).json({
    message: err.message,
    original: err.original?.message,
    parent: err.parent || null
  });
}
};

exports.getOne = async (req, res) => {
  try {
    // 1) On parse et on valide l'ID
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID d\'etudiant invalide' });
    }

    // 2) On récupère l'étudiant en incluant EXACTEMENT les modèles associés
    const etu = await db.etudiant.findByPk(id, {
      include: [
        // Ces 4 belongsTo ont été définis sans "as" dans etudiant.js
        { model: db.formation       },   
        { model: db.cursus          },
        { model: db.statutetudiant  },
        { model: db.etablissement   }
      ]
    });

    // 3) Gestion du non-trouvé
    if (!etu) {
      return res.status(404).json({ message: 'Etudiant non trouvé' });
    }

    // 4) On renvoie l'objet complet
    return res.json(etu);

  } catch (error) {
    console.error('Erreur dans getOne :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message,
      details: error.original?.message || null
    });
  }
};

exports.getEtablissementOne = async (req, res) => {
  const etu = await db.etudiant.findByPk(req.params.id,
    {
      include: [
        {model: db.formation,
          as: 'formation',
          include: [
            {
              model: db.etablissementorigineformation,
              as: 'etablissementorigineformations',
              include: [
                { model: db.etablissement, as: 'etablissement' }
              ]
            }
          ]
        },
        { model: db.etablissement } // Ajout de l'établissement direct
      ]            
    });
  if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });
  res.json(etu);
};

exports.update = async (req, res) => {
  try{
  const etu = await db.etudiant.findByPk(req.params.id);
  if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });
  //console.log('Données reçues pour update:', req.body);

  await etu.update(req.body);
  
  res.json(etu);
  } catch (err) {
    console.error('Erreur lors de la modification:', err.message);
    if (err.parent) {
      console.error('Postgres detail:', err.parent.detail);
      console.error('Routine:', err.parent.routine);
      console.error('Code:', err.parent.code);
      console.error('Contrainte:', err.parent.constraint);
      console.error('Table:', err.parent.table);
      console.error('Colonne:', err.parent.column);
    }
    res.status(500).json({
      message: err.message,
      detail: err.parent?.detail,
      code: err.parent?.code,
      constraint: err.parent?.constraint,
      column: err.parent?.column
    });
  }
};

exports.remove = async (req, res) => {
  const etu = await db.etudiant.findByPk(req.params.id);
  if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });

  await etu.destroy();
  res.status(204).send();
};

exports.getNonDiplomes = async (req, res) => {
  try {
    const etudiants = await db.etudiant.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { estdiplome: false },
          { estdiplome: null }
        ]
      },
      include: [
        { 
          model: db.formation,
          attributes: ['formationId', 'typeFormation']
        },
        { 
          model: db.cursus,
          attributes: ['cursusId', 'cursusLibelle']
        },
        { 
          model: db.statutetudiant,
          attributes: ['statutetudiantid', 'libellestatutetudiant']
        }
      ],
      order: [['nomEtudiant', 'ASC']]
    });

    res.json({
      success: true,
      data: etudiants
    });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: error.message,
      stack: error.stack,
      details: error.original ? error.original.message : null
    });
  }
};

