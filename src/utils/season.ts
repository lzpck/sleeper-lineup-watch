/**
 * Utilitários relacionados à temporada da NFL
 */

/**
 * Retorna a temporada atual da NFL baseada no ano corrente
 * A temporada da NFL geralmente começa em setembro e vai até fevereiro do ano seguinte
 * Por exemplo: temporada 2024 vai de setembro 2024 até fevereiro 2025
 * 
 * @returns String representando o ano da temporada atual
 */
export const getCurrentSeason = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11, então somamos 1
  
  // Se estivermos entre janeiro e julho, ainda estamos na temporada do ano anterior
  // A nova temporada da NFL começa tipicamente em setembro
  if (currentMonth <= 7) {
    return (currentYear - 1).toString();
  }
  
  // Se estivermos entre agosto e dezembro, estamos na temporada do ano atual
  return currentYear.toString();
};

/**
 * Valida se uma string de temporada é válida (formato de ano de 4 dígitos)
 * @param season - String da temporada para validar
 * @returns true se válida, false caso contrário
 */
export const isValidSeason = (season: string): boolean => {
  if (!season || typeof season !== 'string') {
    return false;
  }
  
  // Verifica se é um ano de 4 dígitos entre 1999 e 2050
  const yearPattern = /^\d{4}$/;
  if (!yearPattern.test(season)) {
    return false;
  }
  
  const year = parseInt(season, 10);
  return year >= 1999 && year <= 2050;
};