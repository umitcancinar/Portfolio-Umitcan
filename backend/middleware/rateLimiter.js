const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Çok fazla istek gönderdiniz. Lütfen 15 dakika bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limiter: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Çok fazla giriş denemesi. Lütfen 15 dakika bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Message submission rate limiter: 5 requests per 15 minutes
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Çok fazla mesaj gönderdiniz. Lütfen 15 dakika bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chatbot query rate limiter: 30 requests per 15 minutes
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Çok fazla sorgu gönderdiniz. Lütfen 15 dakika bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  messageLimiter,
  chatbotLimiter,
};
