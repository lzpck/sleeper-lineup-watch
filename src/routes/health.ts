import { Router, Request, Response } from 'express';

// Cria o router para as rotas de health
const healthRouter = Router();

/**
 * GET /health
 * Endpoint de health check que retorna o status da aplicação
 */
healthRouter.get('/health', (req: Request, res: Response) => {
  const healthData = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };

  res.json(healthData);
});

export { healthRouter };