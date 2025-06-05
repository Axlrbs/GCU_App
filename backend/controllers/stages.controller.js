// controllers/stages.controller.js

const db = require('../models');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const stages = await db.stage.findAll({
      include: [
        // on récupère l'étudiant ET tous ses résultats annuels
        {
          model: db.etudiant,
          as: 'etudiant',
          attributes: ['numeroEtudiant','nomEtudiant','prenomEtudiant'],
          include: [
            {
              model: db.resultatAnneeEtudiant,
              as: 'resultatAnneeEtudiants',
              required: false,
              attributes: ['anneeUniversitaireId','promotionId','codeDecision','dateDecisionJurys'],
              include: [
                {
                  model: db.promotion,
                  as: 'promotion',
                  attributes: ['nomPromotion']
                }
              ]
            },
            { model: db.cursus }
          ]
        },
        // on inclut l'année universitaire du stage si besoin
        {
          model: db.anneeUniversitaire,
          as: 'anneeUniversitaire',
          attributes: ['anneeUniversitaireId','libelleAnneeUniversitaire']
        },
        { model: db.entreprise,  as: 'entreprise' },
        { model: db.tuteur,      as: 'tuteurPro'   },
        { model: db.tuteur,      as: 'tuteurPedago'}
      ]
    });

    const flattened = stages.map(stage => {
      // Id de l'année auquel ce stage est rattaché
      const yearId = stage.anneeUniversitaireId;
      // on cherche dans les résultats de l'étudiant celui qui matche
      const resAn = stage.etudiant.resultatAnneeEtudiants
        .find(r => r.anneeUniversitaireId === yearId);

      return {
        ...stage.toJSON(),
        // on écrase ou on ajoute ces champs
        nomPromotion:   resAn?.promotion?.nomPromotion ?? null,
        codeDecision:   resAn?.codeDecision            ?? null,
        dateDecision:   resAn?.dateDecisionJurys       ?? null,
        // on peut aussi exposer le libellé de l’année scolaire si voulu :
        libelleAnneeScolaire: stage.anneeUniversitaire?.libelleAnneeUniversitaire ?? null
      };
    });

    return res.json(flattened);
  } catch (err) {
    console.error('Erreur getAll stages:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const stage = await db.stage.findByPk(req.params.id, {
      include: [
        {
          model: db.etudiant,
          as: 'etudiant',
          attributes: ['numeroEtudiant','nomEtudiant','prenomEtudiant'],
          include: [
            {
              model: db.resultatAnneeEtudiant,
              as: 'resultatAnneeEtudiants',
              required: false,
              attributes: ['anneeUniversitaireId','promotionId','codeDecision','dateDecisionJurys'],
              include: [
                { model: db.promotion, as: 'promotion', attributes: ['nomPromotion'] }
              ]
            }
          ]
        },
        {
          model: db.anneeUniversitaire,
          as: 'anneeUniversitaire',
          attributes: ['anneeUniversitaireId','libelleAnneeUniversitaire']
        },
        { model: db.entreprise,  as: 'entreprise' },
        { model: db.tuteur,      as: 'tuteurPro'   },
        { model: db.tuteur,      as: 'tuteurPedago'}
      ]
    });
    if (!stage) return res.status(404).json({ message: 'Stage non trouvé' });

    const yearId = stage.anneeUniversitaireId;
    const resAn = stage.etudiant.resultatAnneeEtudiants
      .find(r => r.anneeUniversitaireId === yearId);

    const output = {
      ...stage.toJSON(),
      nomPromotion:   resAn?.promotion?.nomPromotion ?? null,
      codeDecision:   resAn?.codeDecision            ?? null,
      dateDecision:   resAn?.dateDecisionJurys       ?? null,
      libelleAnneeScolaire: stage.anneeUniversitaire?.libelleAnneeUniversitaire ?? null
    };

    return res.json(output);
  } catch (err) {
    console.error('Erreur getOne stage:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getTuteursByRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    const tuteurs = await db.tuteur.findAll({
      where: { roleId },
      include: [
        {
          model: db.role,
          attributes: ['roleLibelle']
        }
      ],
      order: [['nomTuteur','ASC'],['prenomTuteur','ASC']]
    });

    res.json(tuteurs);
  } catch (err) {
    console.error('Erreur getTuteursByRole:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }
  try {
    const newStage = await db.stage.create(req.body);
    res.status(201).json(newStage);
  } catch (err) {
    console.error('Erreur create stage:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const stage = await db.stage.findByPk(req.params.id);
    if (!stage) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }
    await stage.update(req.body);
    res.json(stage);
  } catch (err) {
    console.error('Erreur update stage:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const stage = await db.stage.findByPk(req.params.id);
    if (!stage) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }
    await stage.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Erreur remove stage:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
