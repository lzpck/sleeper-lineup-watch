import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configurações do ambiente exportadas como objeto readonly
export const env = {
  PORT: Number(process.env.PORT) || 3000,
  SLEEPER_API_BASE: process.env.SLEEPER_API_BASE || 'https://api.sleeper.app/v1'
} as const;

// Validação básica das variáveis de ambiente
if (isNaN(env.PORT)) {
  throw new Error('PORT deve ser um número válido');
}

if (!env.SLEEPER_API_BASE) {
  throw new Error('SLEEPER_API_BASE é obrigatório');
}