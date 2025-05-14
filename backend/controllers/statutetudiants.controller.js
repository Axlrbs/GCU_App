const db = require('../models');
const StatutEtudiant = db.statutetudiant;

// Récupérer tous les statuts
exports.findAll = async (req, res) => {
    try {
        const statuts = await StatutEtudiant.findAll();
        res.json(statuts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un statut par son ID
exports.findOne = async (req, res) => {
    try {
        const statut = await StatutEtudiant.findByPk(req.params.id);
        if (statut) {
            res.json(statut);
        } else {
            res.status(404).json({ message: "Statut étudiant non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau statut
exports.create = async (req, res) => {
    try {
        const statut = await StatutEtudiant.create(req.body);
        res.status(201).json(statut);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un statut
exports.update = async (req, res) => {
    try {
        const statut = await StatutEtudiant.findByPk(req.params.id);
        if (statut) {
            await statut.update(req.body);
            res.json(statut);
        } else {
            res.status(404).json({ message: "Statut étudiant non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un statut
exports.delete = async (req, res) => {
    try {
        const statut = await StatutEtudiant.findByPk(req.params.id);
        if (statut) {
            await statut.destroy();
            res.json({ message: "Statut étudiant supprimé avec succès" });
        } else {
            res.status(404).json({ message: "Statut étudiant non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};