// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/reports - Liste des signalements
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, c.first_name, c.last_name, c.current_position, u.full_name as reporter_name
            FROM reports r
            JOIN candidates c ON r.candidate_id = c.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/reports - Créer un signalement
router.post('/', async (req, res) => {
    try {
        const { candidate_id, user_id, reason, notes, tags, severity } = req.body;
        const result = await db.query(`
            INSERT INTO reports (candidate_id, user_id, reason, notes, tags, severity)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [candidate_id, user_id, reason, notes, JSON.stringify(tags), severity]);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reason: DataTypes.STRING,
    notes: DataTypes.TEXT,
    tags: DataTypes.JSON,
    severity: DataTypes.INTEGER
  }, {});
  Report.associate = function(models) {
    Report.belongsTo(models.User, { foreignKey: 'userId' });
    Report.belongsTo(models.Candidate, { foreignKey: 'candidateId' });
  };
  return Report;
};