// backend/routes/reports.js
const express = require('express');
const { body, query } = require('express-validator');
const { Report, Candidate, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');
const router = express.Router();

// Get all reports (with pagination and filters)
router.get('/', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('severity').optional().isInt({ min: 1, max: 5 }).toInt()
], async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (req.query.severity) where.severity = req.query.severity;
    if (req.query.candidate_id) where.candidate_id = req.query.candidate_id;
    
    const { count, rows } = await Report.findAndCountAll({
      where,
      include: [
        { model: Candidate, as: 'candidate' },
        { model: User, as: 'reporter', attributes: ['id', 'full_name', 'email'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      data: rows,
      meta: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new report
router.post('/', [
  authMiddleware,
  body('candidate_id').isInt().notEmpty(),
  body('reason').isString().notEmpty(),
  body('severity').isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const report = await Report.create({
      candidate_id: req.body.candidate_id,
      user_id: req.user.id,
      reason: req.body.reason,
      notes: req.body.notes,
      tags: req.body.tags,
      severity: req.body.severity,
      ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    
    // Fetch full report with relationships
    const fullReport = await Report.findByPk(report.id, {
      include: [
        { model: Candidate, as: 'candidate' },
        { model: User, as: 'reporter' }
      ]
    });
    
    res.status(201).json(fullReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CSV Export
router.get('/export', [
  authMiddleware,
  rbacMiddleware('admin')
], async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: Candidate, as: 'candidate' },
        { model: User, as: 'reporter' }
      ]
    });
    
    let csv = 'ID,Candidate Name,Reporter,Reason,Severity,Date\n';
    reports.forEach(report => {
      csv += `"${report.id}","${report.candidate.first_name} ${report.candidate.last_name}",`;
      csv += `"${report.reporter.full_name}","${report.reason}",`;
      csv += `"${report.severity}","${report.created_at.toISOString()}"\n`;
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment('reports.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;