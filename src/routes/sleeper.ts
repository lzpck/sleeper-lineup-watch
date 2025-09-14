import { Router, Request, Response, NextFunction } from 'express';
import { getUserByUsername, getLeaguesByUserId, getRosterByUser, getAllPlayers, filterPlayersByStatus, isValidUsername } from '../services/sleeper';
import { getCurrentSeason } from '../utils/season';

// Cria o router para as rotas do Sleeper
const sleeperRouter = Router();

/**
 * GET /sleeper/user/:username
 * Busca um usuário na API do Sleeper pelo username
 */
sleeperRouter.get('/user/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    
    // Valida o username
    if (!isValidUsername(username)) {
      return res.status(400).json({
        error: 'Username inválido. Deve conter apenas letras, números e underscore.'
      });
    }
    
    // Busca o usuário na API do Sleeper
    const user = await getUserByUsername(username);
    
    // Se não encontrou o usuário, retorna 404
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Retorna os dados do usuário
    res.json(user);
    
  } catch (error) {
    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
});

/**
 * GET /sleeper/user/:username/leagues
 * Busca todas as ligas de um usuário na temporada atual da NFL
 */
sleeperRouter.get('/user/:username/leagues', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    
    // Valida o username
    if (!isValidUsername(username)) {
      return res.status(400).json({
        error: 'Username inválido. Deve conter apenas letras, números e underscore.'
      });
    }
    
    // Busca o usuário na API do Sleeper
    const user = await getUserByUsername(username);
    
    // Se não encontrou o usuário, retorna 404
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Obtém a temporada atual e busca as ligas do usuário
    const currentSeason = getCurrentSeason();
    const leagues = await getLeaguesByUserId(user.user_id, currentSeason);
    
    // Retorna as ligas (array vazio se não tiver nenhuma)
    res.json(leagues);
    
  } catch (error) {
    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
});

/**
 * GET /sleeper/league/:leagueId/roster/:userId
 * Busca o roster de um usuário específico em uma liga
 */
sleeperRouter.get('/league/:leagueId/roster/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { leagueId, userId } = req.params;
    
    // Valida se os parâmetros não estão vazios
    if (!leagueId || !userId) {
      return res.status(400).json({
        error: 'League ID e User ID são obrigatórios'
      });
    }
    
    // Busca o roster do usuário na liga
    const roster = await getRosterByUser(leagueId, userId);
    
    // Se não encontrou o roster, retorna 404
    if (!roster) {
      return res.status(404).json({
        error: 'Roster not found for this user'
      });
    }
    
    // Retorna o roster encontrado
    res.json(roster);
    
  } catch (error) {
    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
});

/**
 * POST /sleeper/players/status
 * Busca jogadores com status de lesão problemático
 */
sleeperRouter.post('/players/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { playerIds } = req.body;
    
    // Valida se playerIds é um array não vazio
    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      return res.status(400).json({
        error: 'playerIds deve ser um array não vazio'
      });
    }
    
    // Valida se todos os elementos são strings
    if (!playerIds.every(id => typeof id === 'string')) {
      return res.status(400).json({
        error: 'Todos os playerIds devem ser strings'
      });
    }
    
    // Busca todos os jogadores da NFL
    const allPlayers = await getAllPlayers();
    
    // Filtra jogadores com status problemático
    const problematicPlayers = filterPlayersByStatus(playerIds, allPlayers);
    
    // Retorna o array filtrado (pode ser vazio se nenhum jogador problemático for encontrado)
    res.json(problematicPlayers);
    
  } catch (error) {
    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
});

/**
 * GET /sleeper/user/:username/questionable
 * Busca jogadores titulares com status duvidoso em todas as ligas do usuário na temporada atual
 */
sleeperRouter.get('/user/:username/questionable', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    
    // Valida o username
    if (!isValidUsername(username)) {
      return res.status(400).json({
        error: 'Username inválido'
      });
    }
    
    // Busca o usuário
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Busca as ligas do usuário na temporada atual
    const currentSeason = getCurrentSeason();
    const leagues = await getLeaguesByUserId(user.user_id, currentSeason);
    
    if (!leagues || leagues.length === 0) {
      return res.json([]);
    }
    
    // Busca todos os jogadores uma vez
    const allPlayers = await getAllPlayers();
    
    // Array para armazenar o resultado consolidado
    const result = [];
    
    // Para cada liga, busca o roster e filtra jogadores titulares problemáticos
    for (const league of leagues) {
      const roster = await getRosterByUser(league.league_id, user.user_id);
      
      // Se não tem roster nesta liga, pula
      if (!roster || !roster.starters || roster.starters.length === 0) {
        continue;
      }
      
      // Filtra apenas os jogadores titulares com status problemático
      const questionableStarters = filterPlayersByStatus(roster.starters, allPlayers);
      
      // Se encontrou jogadores problemáticos, adiciona ao resultado
      if (questionableStarters.length > 0) {
        result.push({
          league: {
            league_id: league.league_id,
            name: league.name
          },
          questionable_starters: questionableStarters
        });
      }
    }
    
    // Retorna o resultado consolidado
    res.json(result);
    
  } catch (error) {
    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
});

export { sleeperRouter };