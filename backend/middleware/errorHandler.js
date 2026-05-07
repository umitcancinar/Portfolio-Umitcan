/**
 * Custom error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log error
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Dosya boyutu çok büyük. Maksimum 5MB yükleyebilirsiniz.'
    });
  }

  // Multer unexpected file
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Beklenmeyen dosya alanı.'
    });
  }

  // Multer general error (like file type)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Validation errors
  if (err.type === 'validation') {
    return res.status(422).json({
      error: 'Doğrulama hatası',
      details: err.errors
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';

  res.status(statusCode).json({ error: message });
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({ error: `Endpoint bulunamadı: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
