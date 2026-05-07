const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getLatestCv, uploadCv, deleteUpload, listUploads } = require('../controllers/uploadController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece PDF, DOC, DOCX ve resim dosyaları yüklenebilir.'));
    }
  },
});

// Public
router.get('/cv/latest', getLatestCv);

// Admin
router.post('/cv', authenticateToken, requireRole('admin', 'editor'), upload.single('file'), uploadCv);
router.get('/', authenticateToken, requireRole('admin'), listUploads);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUpload);

module.exports = router;
