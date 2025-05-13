const db = require('../models');
const { validationResult } = require('express-validator');

const { Op } = require('sequelize');

 exports.getAll = async (req, res) => {
   try {
     const page   = parseInt(req.query.page)  || 1;
     const limit  = Math.min(parseInt(req.query.limit) || 10, 100);
     const search = req.query.search || '';
     const offset = (page - 1) * limit;

     // construction du WHERE pour le search
     const where = {};
     if (search) {
       where[Op.or] = [
         { '$etudiant.nomEtudiant$':    { [Op.iLike]: `%${search}%` } },
         { '$etudiant.prenomEtudiant$': { [Op.iLike]: `%${search}%` } },
       ];
     }

     const { count, rows } = await db.etudiantParticipePartenariat.findAndCountAll({
       where,
       include: [
         { model: db.etudiant },
         { model: db.partenaire },
         { model: db.naturePartenariat }
       ],
       limit,
       offset,
       order: [['idParticipation', 'DESC']]   // on met les plus récents en page 1
     });

     res.json({
       success:     true,
       totalItems:  count,
       totalPages:  Math.ceil(count / limit),
       currentPage: page,
       data:        rows
     });
   } catch (err) {
     res.status(500).json({ message: 'Erreur serveur', error: err.message });
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

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ erreurs: errors.array() });

  const { numeroEtudiant, certificationLangueId, score } = req.body;

  try {
    // Vérifier si l'étudiant a déjà cette certification
    const exist = await db.etudiantPasseCertification.findOne({
      where: { numeroEtudiant, certificationLangueId }
    });

    if (exist) {
      return res.status(400).json({ message: "Cette certification existe déjà pour cet étudiant." });
    }

    const newCertification = await db.etudiantPasseCertification.create({
      numeroEtudiant,
      certificationLangueId,
      scoreCertification: score
    });

    res.status(201).json(newCertification);
  } catch (err) {
    console.error("Erreur serveur :", err.message);
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
      // supprime l’ancienne entrée
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
