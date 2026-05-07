const express = require('express');
const router = express.Router();
const { getReferences, getReference, createReference, updateReference, deleteReference } = require('../controllers/referenceController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public read
router.get('/', getReferences);
router.get('/:id', getReference);

// Admin write
router.post('/', authenticateToken, requireRole('admin', 'editor'), createReference);
router.put('/:id', authenticateToken, requireRole('admin', 'editor'), updateReference);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteReference);

module.exports = router;
