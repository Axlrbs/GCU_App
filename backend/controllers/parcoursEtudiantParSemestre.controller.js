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
