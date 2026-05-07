const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Allowed file types
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const allowedLogoTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

// Max file size: 5MB
const MAX_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024;

/**
 * Create multer storage for a given subdirectory
 */
function createStorage(subDir) {
  const uploadPath = path.join(__dirname, '..', 'uploads', subDir);
  
  // Ensure directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${subDir}-${uniqueSuffix}${ext}`);
    }
  });
}

/**
 * File filter factory
 */
function fileFilter(allowedTypes) {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Dosya tipi desteklenmiyor. İzin verilen tipler: ${allowedTypes.join(', ')}`), false);
    }
  };
}

// Upload instances for different purposes
const uploadProjectImage = multer({
  storage: createStorage('projects'),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter(allowedImageTypes),
});

const uploadCv = multer({
  storage: createStorage('cv'),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter(allowedDocTypes),
});

const uploadReferenceLogo = multer({
  storage: createStorage('references'),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter(allowedLogoTypes),
});

module.exports = {
  uploadProjectImage,
  uploadCv,
  uploadReferenceLogo,
};
