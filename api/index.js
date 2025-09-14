const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Cria aplicação Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos do frontend
let frontendPath = path.join(__dirname, '../sleeper-lineup-watch-ui/dist');

// Verifica caminhos alternativos
if (!fs.existsSync(frontendPath)) {
  const alternativePaths = [
    path.join(process.cwd(), 'sleeper-lineup-watch-ui/dist'),
    path.join(process.cwd(), 'dist'),
    path.join(__dirname, 'dist')
  ];
  
  for (const altPath of alternativePaths) {
    if (fs.existsSync(altPath)) {
      frontendPath = altPath;
      break;
    }
  }
}

console.log('Frontend path:', frontendPath);
app.use(express.static(frontendPath));

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Sleeper Lineup Watch API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      sleeper: '/api/sleeper'
    }
  });
});

// Fallback para SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Exporta para Vercel
module.exports = app;