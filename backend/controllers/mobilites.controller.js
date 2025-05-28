const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  const data = await db.mobilite.findAll({
    include: [
        { model: db.etudiant, as: 'etudiant', include :[
          { model : db.resultatAnneeEtudiant, include : [
            { model : db.promotion}
          ]}
        ]},
        { model: db.typeMobilite },
        { model: db.anneeUniversitaire },
        { model: db.etat, as: 'etatContratEtude' },
        { model: db.etat, as: 'etatReleveNote' },
        { model: db.etablissement, include: [
          {model: db.ville, include: [
            {model: db.pays}
          ]}
        ]},
        {
          model: db.entreprise,
          include: [
            {
              model: db.ville,
              include: [{ model: db.pays }]
            }
          ]
        }
      ]  });
  res.json(data);
};

exports.getOne = async (req, res) => {
  try {
    const item = await db.mobilite.findByPk(req.params.id, {
      include: [
        { 
          model: db.etudiant, 
          as: 'etudiant',
          attributes: ['numeroEtudiant', 'nomEtudiant', 'prenomEtudiant']
        },
        { 
          model: db.typeMobilite,
          attributes: ['typeMobiliteId', 'libelleTypeMobilite']
        },
        { 
          model: db.anneeUniversitaire,
          attributes: ['anneeUniversitaireId', 'libelleAnneeUniversitaire']
        },
        { 
          model: db.etat,
          as: 'etatContratEtude',
          attributes: ['etatId', 'libelleEtat']
        },
        { 
          model: db.etat,
          as: 'etatReleveNote',
          attributes: ['etatId', 'libelleEtat']
        },
        { 
          model: db.etablissement,
          attributes: ['etablissementId', 'nomEtablissement']
        },
        {
          model: db.entreprise,
          include: [
            {
              model: db.ville,
              include: [{ model: db.pays }]
            }
          ]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Mobilité non trouvée'
      });
    }

    // Log pour debug
    console.log('Mobilité trouvée:', JSON.stringify(item, null, 2));

    res.json({
      success: true,
      data: item
    });
  } catch (err) {
    console.error('Erreur détaillée:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la mobilité',
      error: err.message
    });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const newItem = await db.mobilite.create(req.body);
  res.status(201).json(newItem);
};

exports.update = async (req, res) => {
  const item = await db.mobilite.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Mobilité non trouvée' });

  await item.update(req.body);
  res.json(item);
};

exports.remove = async (req, res) => {
  const item = await db.mobilite.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Mobilité non trouvée' });

  await item.destroy();
  res.status(204).send();
};
