// backend/routes/users.js
const express = require('express');
const { User } = require('../migrations/models');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');
const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['access_token'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: List all users
router.get('/', [
  authMiddleware,
  rbacMiddleware('admin')
], async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'role', 'created_at']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;