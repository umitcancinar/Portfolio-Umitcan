require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL (Neon.tech)',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const contentRoutes = require('./routes/content');
const projectRoutes = require('./routes/projects');
const referenceRoutes = require('./routes/references');
const uploadRoutes = require('./routes/uploads');
const chatbotRoutes = require('./routes/chatbot');
const gameRoutes = require('./routes/game');

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/references', referenceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/game', gameRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server] Hata:', err.message);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Dosya boyutu çok büyük (max 10MB).' });
  }
  res.status(500).json({ error: 'Sunucu hatası.' });
});

// Start
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`[Server] Port ${PORT} üzerinde çalışıyor.`);
      console.log(`[Server] Health: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('[Server] Başlatılamadı:', err.message);
    process.exit(1);
  }
}

start();
