import axios from 'axios';
import { env } from '../config/env';

/**
 * Interface para o objeto de usuário retornado pela API do Sleeper
 */
export interface SleeperUser {
  user_id: string;
  username: string;
  display_name?: string;
}

/**
 * Interface para o objeto de liga retornado pela API do Sleeper
 */
export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  sport: string;
  status: string;
}

/**
 * Interface para o objeto de roster retornado pela API do Sleeper
 */
export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  starters: string[]; // array de player_ids
  players: string[];
}

/**
 * Interface para o objeto de jogador retornado pela API do Sleeper
 */
export interface SleeperPlayer {
  player_id: string;
  full_name: string;
  position: string;
  team: string;
  injury_status?: "questionable" | "doubtful" | "out" | "active" | "IR" | "SUS" | "PUP" | "NA" | "DNR" | "COV" | "SUSP" | "NFI-R" | "NFI-A" | "CEL" | null;
}

/**
 * Busca um usuário na API do Sleeper pelo username
 * @param username - Nome de usuário para buscar
 * @returns Dados do usuário ou null se não encontrado
 */
export const getUserByUsername = async (username: string): Promise<SleeperUser | null> => {
  try {
    const response = await axios.get<SleeperUser>(
      `${env.SLEEPER_API_BASE}/user/${username}`
    );
    
    return response.data;
  } catch (error: any) {
    // Se o erro for 404, o usuário não foi encontrado
    if (error.response?.status === 404) {
      return null;
    }
    
    // Para outros erros, propaga a exceção
    throw error;
  }
};

/**
 * Busca todas as ligas de um usuário na API do Sleeper para uma temporada específica
 * @param userId - ID do usuário
 * @param season - Temporada (ano) para buscar as ligas
 * @returns Array de ligas do usuário ou array vazio se não encontrar
 */
export const getLeaguesByUserId = async (userId: string, season: string): Promise<SleeperLeague[]> => {
  try {
    const response = await axios.get<SleeperLeague[]>(
      `${env.SLEEPER_API_BASE}/user/${userId}/leagues/nfl/${season}`
    );
    
    return response.data || [];
  } catch (error: any) {
    // Se o erro for 404, o usuário não tem ligas na temporada
    if (error.response?.status === 404) {
      return [];
    }
    
    // Para outros erros, propaga a exceção
    throw error;
  }
};

/**
 * Busca o roster de um usuário específico em uma liga
 * @param leagueId - ID da liga
 * @param userId - ID do usuário
 * @returns Roster do usuário ou null se não encontrado
 */
export const getRosterByUser = async (leagueId: string, userId: string): Promise<SleeperRoster | null> => {
  try {
    const response = await axios.get<SleeperRoster[]>(
      `${env.SLEEPER_API_BASE}/league/${leagueId}/rosters`
    );
    
    // Filtra o roster onde owner_id === userId
    const userRoster = response.data.find(roster => roster.owner_id === userId);
    
    return userRoster || null;
  } catch (error: any) {
    // Se o erro for 404, a liga não foi encontrada ou não tem rosters
    if (error.response?.status === 404) {
      return null;
    }
    
    // Para outros erros, propaga a exceção
    throw error;
  }
};

/**
 * Busca todos os jogadores da NFL na API do Sleeper
 * @returns Objeto com todos os jogadores indexados por player_id
 */
export const getAllPlayers = async (): Promise<Record<string, SleeperPlayer>> => {
  try {
    const response = await axios.get<Record<string, SleeperPlayer>>(
      `${env.SLEEPER_API_BASE}/players/nfl`
    );
    
    return response.data;
  } catch (error: any) {
    // Para erros, propaga a exceção
    throw error;
  }
};

/**
 * Filtra jogadores por status de lesão problemático
 * @param playerIds - Array de IDs dos jogadores para filtrar
 * @param allPlayers - Objeto com todos os jogadores
 * @returns Array de jogadores com status problemático
 */
export const filterPlayersByStatus = (
  playerIds: string[],
  allPlayers: Record<string, SleeperPlayer>
): SleeperPlayer[] => {
  // Status problemáticos que indicam jogadores duvidosos ou indisponíveis
  // Baseado na documentação oficial do Sleeper para elegibilidade de IR
  const problematicStatuses = [
    "questionable", "doubtful", "out", "IR", "SUS", "SUSP", 
    "PUP", "NA", "DNR", "COV", "NFI-R", "NFI-A", "CEL"
  ];
  
  return playerIds
    .map(playerId => allPlayers[playerId]) // Pega os jogadores que existem
    .filter(player => {
      if (!player || !player.injury_status) return false;
      // Comparação case-insensitive para capturar variações como "Out" vs "out"
      return problematicStatuses.some(status => 
        status.toLowerCase() === player.injury_status!.toLowerCase()
      );
    });
};

/**
 * Valida se um username é válido (não vazio e sem caracteres especiais)
 * @param username - Username para validar
 * @returns true se válido, false caso contrário
 */
export const isValidUsername = (username: string): boolean => {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // Remove espaços e verifica se não está vazio
  const trimmed = username.trim();
  if (trimmed.length === 0) {
    return false;
  }
  
  // Verifica se contém apenas caracteres alfanuméricos e underscore
  const validPattern = /^[a-zA-Z0-9_]+$/;
  return validPattern.test(trimmed);
};