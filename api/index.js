const express = require('express');
const cors = require('cors');

// Cria aplicação Express apenas para API
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Sleeper Lineup Watch API'
  });
});

app.get('/api/sleeper', (req, res) => {
  res.json({ 
    message: 'Sleeper API endpoint',
    status: 'available',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Sleeper Lineup Watch API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      sleeper: '/api/sleeper'
    },
    timestamp: new Date().toISOString()
  });
});

// Rota de compatibilidade
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Sleeper Lineup Watch API'
  });
});

// Middleware para rotas não encontradas da API
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Exporta para Vercel
module.exports = app;