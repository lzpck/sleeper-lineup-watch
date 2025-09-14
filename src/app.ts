import express from 'express';
import cors from 'cors';
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

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'Sleeper Lineup Watch API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      sleeper: '/sleeper'
    }
  });
});

// Registra as rotas
app.use('/', healthRouter); // Rota de health check em /health
app.use('/sleeper', sleeperRouter); // Rotas da API do Sleeper

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Exporta a aplicação configurada
export { app };