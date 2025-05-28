const { nationalite, pays } = require('../models');

// GET : Toutes les nationalités avec leur pays
exports.getAllNationalites = async (req, res) => {
  try {
    const nationalites = await nationalite.findAll({
      include: [
        {
          model: pays,
          attributes: ['nomPays']
        }
      ],
      attributes: ['nationaliteid', 'libellenationalite', 'codePays']
    });
    res.json(nationalites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET : Nationalité par ID (avec pays)
exports.getNationaliteById = async (req, res) => {
  try {
    const nat = await nationalite.findByPk(req.params.id, {
      include: [
        {
          model: pays,
          attributes: ['nomPays']
        }
      ],
      attributes: ['nationaliteid', 'libellenationalite', 'codePays']
    });
    if (!nat) return res.status(404).json({ message: "Nationalité non trouvée" });
    res.json(nat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST : Créer une nationalité
exports.createNationalite = async (req, res) => {
  try {
    const nat = await nationalite.create(req.body);
    res.status(201).json(nat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT : Modifier une nationalité
exports.updateNationalite = async (req, res) => {
  try {
    const [nb] = await nationalite.update(req.body, {
      where: { nationaliteid: req.params.id }
    });
    if (nb === 0) return res.status(404).json({ message: "Nationalité non trouvée" });
    res.json({ message: "Nationalité mise à jour" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE : Supprimer une nationalité
exports.deleteNationalite = async (req, res) => {
  try {
    const nb = await nationalite.destroy({
      where: { nationaliteid: req.params.id }
    });
    if (nb === 0) return res.status(404).json({ message: "Nationalité non trouvée" });
    res.json({ message: "Nationalité supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
