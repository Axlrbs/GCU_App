const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100
    const offset = (page - 1) * limit;

    const search = req.query.search || '';

    const { count, rows } = await db.etudiant.findAndCountAll({
      where: search ? {
        [db.Sequelize.Op.or]: [
          { nomEtudiant: { [db.Sequelize.Op.iLike]: `%${search}%` } },
          { prenomEtudiant: { [db.Sequelize.Op.iLike]: `%${search}%` } }
        ]
      } : undefined,
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
          } ,    
        { model: db.cursus },
        { model: db.statutetudiant },
        { model: db.etablissement } // Ajout de l'établissement
      ],
      limit,
      offset,
      order: [['nomEtudiant', 'ASC']] // Tu peux changer selon besoin
    });

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }
  console.log('Données reçues pour create:', req.body);
  const newEtu = await db.etudiant.create(req.body);
  res.status(201).json(newEtu);
};

exports.getOne = async (req, res) => {
  const etu = await db.etudiant.findByPk(req.params.id,
    {
      include: [
        { model: db.formation },
        { model: db.cursus },
        { model: db.statutetudiant },
        { model: db.etablissement } // Ajout de l'établissement
      ]
    });
  if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });
  res.json(etu);
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
  const etu = await db.etudiant.findByPk(req.params.id);
  if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });
  //console.log('Données reçues pour update:', req.body);

  await etu.update(req.body);
  res.json(etu);
};

exports.remove = async (req, res) => {
  const etu = await db.etudiant.findByPk(req.params.id);
  if (!etu) return res.status(404).json({ message: 'Étudiant non trouvé' });

  await etu.destroy();
  res.status(204).send();
};