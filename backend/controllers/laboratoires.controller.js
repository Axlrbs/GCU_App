// controllers/laboratoire.controller.js

const { laboratoire, etablissement, ville, pays } = require('../models');

// GET : Liste tous les laboratoires avec ville & pays de l'établissement
exports.getAllLaboratoires = async (req, res) => {
  try {
    const labos = await laboratoire.findAll({
      include: [
        {
          model: etablissement,
          as: 'etablissement',
          include: [
            {   
                model: ville, 
                as: 'ville',
                include: [
                    { 
                        model: pays, 
                        as: 'pay'
                    }
                ]
             }
          ],
          attributes: ['etablissementId', 'nomEtablissement']
        }
      ],
      attributes: ['laboratoireid', 'nomlaboratoire']
    });
    res.json(labos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET : Laboratoire par ID (avec ville & pays)
exports.getLaboratoireById = async (req, res) => {
  try {
    const labo = await laboratoire.findByPk(req.params.id, {
      include: [
        {
          model: etablissement,
          as: 'etablissement',
          include: [
            { model: ville, as: 'ville', attributes: ['nomVille'] },
            { model: pays, as: 'pay', attributes: ['nomPays'] }
          ],
          attributes: ['etablissementId', 'nomEtablissement']
        }
      ],
      attributes: ['laboratoireid', 'nomlaboratoire']
    });
    if (!labo) return res.status(404).json({ message: "Laboratoire non trouvé" });
    res.json(labo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST : Créer un laboratoire
exports.createLaboratoire = async (req, res) => {
  try {
    const labo = await laboratoire.create(req.body);
    res.status(201).json(labo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT : Modifier un laboratoire
exports.updateLaboratoire = async (req, res) => {
  try {
    const [nb, rows] = await laboratoire.update(req.body, {
      where: { laboratoireid: req.params.id }
    });
    if (nb === 0) return res.status(404).json({ message: "Laboratoire non trouvé" });
    res.json({ message: "Laboratoire mis à jour" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE : Supprimer un laboratoire
exports.deleteLaboratoire = async (req, res) => {
  try {
    const nb = await laboratoire.destroy({
      where: { laboratoireid: req.params.id }
    });
    if (nb === 0) return res.status(404).json({ message: "Laboratoire non trouvé" });
    res.json({ message: "Laboratoire supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
