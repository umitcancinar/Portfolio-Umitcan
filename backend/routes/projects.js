const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public read
router.get('/', getProjects);
router.get('/:id', getProject);

// Admin write
router.post('/', authenticateToken, requireRole('admin', 'editor'), createProject);
router.put('/:id', authenticateToken, requireRole('admin', 'editor'), updateProject);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteProject);

module.exports = router;
