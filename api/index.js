// Função serverless para Vercel
const { app } = require('../dist/app');

/**
 * Handler para serverless function na Vercel
 * @param {import('http').IncomingMessage} req - Request object
 * @param {import('http').ServerResponse} res - Response object
 */
module.exports = async (req, res) => {
  try {
    // Configura headers CORS para todas as respostas
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Delega para a aplicação Express
    return app(req, res);
  } catch (error) {
    console.error('Erro na serverless function:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro interno do servidor'
    });
  }
};