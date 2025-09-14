// Handler nativo para Vercel sem Express
module.exports = (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Configurar Content-Type para JSON
  res.setHeader('Content-Type', 'application/json');

  const { url, method } = req;
  const timestamp = new Date().toISOString();

  // Roteamento manual
  if (method === 'GET') {
    if (url === '/api/health' || url === '/health') {
      res.status(200).json({
        status: 'ok',
        timestamp,
        service: 'Sleeper Lineup Watch API'
      });
      return;
    }

    if (url === '/api/sleeper') {
      res.status(200).json({
        message: 'Sleeper API endpoint',
        status: 'available',
        timestamp
      });
      return;
    }

    if (url === '/api' || url === '/api/') {
      res.status(200).json({
        message: 'Sleeper Lineup Watch API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          health: '/api/health',
          sleeper: '/api/sleeper'
        },
        timestamp
      });
      return;
    }

    // Rota não encontrada
    if (url.startsWith('/api/')) {
      res.status(404).json({
        error: 'API endpoint not found',
        path: url,
        timestamp
      });
      return;
    }
  }

  // Método não permitido
  res.status(405).json({
    error: 'Method not allowed',
    method,
    timestamp
  });
};