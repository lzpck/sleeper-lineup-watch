import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de tratamento de erros central
 * Captura todos os erros da aplicação e retorna uma resposta padronizada
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log do erro no console para debug
  console.error('Erro capturado:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Define o status code (500 se não estiver definido)
  const statusCode = error.status || error.statusCode || 500;

  // Resposta padronizada de erro
  res.status(statusCode).json({
    error: 'Internal Server Error'
  });
};