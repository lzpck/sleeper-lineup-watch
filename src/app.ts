import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { healthRouter } from './routes/health';
import { sleeperRouter } from './routes/sleeper';
import { errorHandler } from './middleware/error';

/**
 * Cria e configura a aplicação Express
 */
const app = express();

// Middlewares globais
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Parser para JSON no body das requisições
app.use(express.urlencoded({ extended: true })); // Parser para dados de formulário

// Serve arquivos estáticos do frontend React
// Na Vercel, verifica se existe a pasta dist do frontend
let frontendPath = path.join(__dirname, '../sleeper-lineup-watch-ui/dist');

// Fallback para desenvolvimento local ou estrutura diferente
if (!fs.existsSync(frontendPath)) {
  // Tenta outros caminhos possíveis
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
app.use('/api/health', healthRouter); // Rota de health check em /api/health
app.use('/api/sleeper', sleeperRouter); // Rotas da API do Sleeper em /api/sleeper

// Rota de health check adicional (compatibilidade)
app.use('/health', healthRouter);
app.use('/sleeper', sleeperRouter);

// Rota da API principal
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

// Fallback para SPA - serve index.html para todas as rotas não-API
app.get('*', (req, res) => {
  // Se a rota começa com /api, retorna 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Para todas as outras rotas, serve o index.html do React
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Exporta a aplicação configurada
export { app };