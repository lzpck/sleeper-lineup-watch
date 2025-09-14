# Sleeper Lineup Watch

Backend em Node.js com Express e TypeScript para monitoramento de lineups do Sleeper.

## Descrição

Este projeto fornece uma API REST para monitorar e gerenciar lineups de fantasy football através da API do Sleeper. Inclui um frontend moderno em React com layout de cards responsivo para visualização dos jogadores com status duvidoso.

## Frontend (React + Vite)

O frontend oferece uma interface moderna e responsiva para consultar jogadores titulares com status duvidoso:

### Características:
- **Landing Page Inicial**: Tela de boas-vindas com instruções claras quando nenhuma busca foi realizada
- **Busca Manual**: A busca só é executada quando o usuário clica no botão "Buscar jogadores", não automaticamente
- **Footer Fixo**: Rodapé com créditos do desenvolvedor e chave PIX disponível com botão de copiar
- **Layout de Cards Responsivo**: Adapta automaticamente o layout conforme o tamanho da tela
  - Desktop: 3 colunas
  - Tablet: 2 colunas  
  - Mobile: 1 coluna
- **Suporte Completo a Jogadores IDP**: Exibe jogadores de defesa (DL, LB, DB) além dos tradicionais
- **Status de Lesão Abrangente**: Suporte a todos os status da API do Sleeper com cores específicas:
  - **Questionable**: Amarelo (#facc15)
  - **Doubtful**: Laranja (#fb923c)
  - **Out**: Vermelho (#ef4444)
  - **IR (Injured Reserve)**: Cinza (#6b7280)
  - **SUS/SUSP (Suspended)**: Laranja forte (#f97316)
  - **PUP (Physically Unable to Perform)**: Azul (#3b82f6)
  - **NA (Not Active)**: Cinza claro (#9ca3af)
  - **DNR (Did Not Report)**: Vermelho (#ef4444)
  - **COV (COVID-19)**: Verde (#22c55e)
  - **NFI-R/NFI-A (Non-Football Injury)**: Azul claro (#0ea5e9)
  - **CEL (Commissioner's Exempt List)**: Amarelo escuro (#eab308)
- **Design Inspirado no Sleeper**: Tema escuro moderno com tipografia Inter
- **Filtros Avançados**: Por liga, posição (incluindo IDP) e status de lesão
- **Badges Informativos**: Posição e time destacados com cores distintas

### Executar o Frontend:
```bash
cd sleeper-lineup-watch-ui
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173/`

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente (opcional):**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` se necessário.

3. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Para produção:**
   ```bash
   npm run build
   npm start
   ```

## Endpoints Disponíveis

### Health Check
- **GET** `/health`
  - Retorna o status da aplicação
  - Resposta:
    ```json
    {
      "status": "ok",
      "uptime": 123.456,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
    ```

### API do Sleeper

#### Buscar Usuário
- **GET** `/sleeper/user/:username`
  - Busca um usuário na API do Sleeper pelo username
  - Exemplo: `/sleeper/user/someusername`
  - **Resposta de sucesso (200):**
    ```json
    {
      "user_id": "123456789",
      "username": "someusername",
      "display_name": "Some User"
    }
    ```
  - **Erro - Usuário não encontrado (404):**
    ```json
    {
      "error": "User not found"
    }
    ```
  - **Erro - Username inválido (400):**
     ```json
     {
       "error": "Username inválido. Deve conter apenas letras, números e underscore."
     }
     ```

#### Buscar Roster do Usuário
- **GET** `/sleeper/league/:leagueId/roster/:userId`
  - Busca o roster (escalação) de um usuário específico em uma liga
  - Exemplo: `/sleeper/league/123456789/roster/987654`
  - **Resposta de sucesso (200):**
    ```json
    {
      "roster_id": 1,
      "owner_id": "987654",
      "starters": ["1234", "5678", "9101", "1121", "3141", "5161", "7181", "9202", "2232"],
      "players": ["1234", "5678", "9101", "1121", "3141", "5161", "7181", "9202", "2232", "4252", "6272", "8292", "0313", "3334", "5354", "7374"]
    }
    ```
  - **Erro - Roster não encontrado (404):**
    ```json
    {
      "error": "Roster not found for this user"
    }
    ```
  - **Erro - Parâmetros inválidos (400):**
    ```json
    {
      "error": "League ID e User ID são obrigatórios"
    }
     ```

#### Buscar Jogadores com Status Problemático
- **POST** `/sleeper/players/status`
  - Busca jogadores com status de lesão problemático (questionable, doubtful, out)
  - **Body da requisição:**
    ```json
    {
      "playerIds": ["1234", "5678", "9999"]
    }
    ```
  - **Resposta de sucesso (200):**
    ```json
    [
      {
        "player_id": "1234",
        "full_name": "John Doe",
        "position": "RB",
        "team": "DAL",
        "injury_status": "questionable"
      }
    ]
    ```
  - **Resposta quando nenhum jogador problemático encontrado (200):**
    ```json
    []
    ```
  - **Erro - Array inválido (400):**
    ```json
    {
      "error": "playerIds deve ser um array não vazio"
    }
    ```
  - **Erro - Tipos inválidos (400):**
    ```json
    {
      "error": "Todos os playerIds devem ser strings"
    }
     ```

#### Buscar Jogadores Titulares com Status Duvidoso
- **GET** `/sleeper/user/:username/questionable`
  - Consolida informações de todas as ligas do usuário na temporada atual
  - Retorna apenas jogadores titulares com status problemático (questionable, doubtful, out)
  - Exemplo: `/sleeper/user/johndoe/questionable`
  - **Resposta de sucesso (200):**
    ```json
    [
      {
        "league": {
          "league_id": "123456789",
          "name": "My Fantasy League"
        },
        "questionable_starters": [
          {
            "player_id": "456",
            "full_name": "John Doe",
            "position": "RB",
            "team": "DAL",
            "injury_status": "questionable"
          }
        ]
      }
    ]
    ```
  - **Resposta quando nenhum jogador problemático encontrado (200):**
    ```json
    []
    ```
  - **Erro - Username inválido (400):**
    ```json
    {
      "error": "Username inválido"
    }
    ```
  - **Erro - Usuário não encontrado (404):**
    ```json
    {
      "error": "User not found"
    }
    ```

#### Listar Ligas do Usuário
- **GET** `/sleeper/user/:username/leagues`
  - Lista todas as ligas do usuário na temporada atual da NFL
  - Exemplo: `/sleeper/user/someusername/leagues`
  - **Resposta de sucesso (200):**
    ```json
    [
      {
        "league_id": "123456789",
        "name": "My Fantasy League",
        "season": "2025",
        "sport": "nfl",
        "status": "in_season"
      },
      {
        "league_id": "987654321",
        "name": "Work League",
        "season": "2025",
        "sport": "nfl",
        "status": "complete"
      }
    ]
    ```
  - **Usuário sem ligas (200):**
    ```json
    []
    ```
  - **Erro - Usuário não encontrado (404):**
    ```json
    {
      "error": "User not found"
    }
    ```
  - **Erro - Username inválido (400):**
    ```json
    {
      "error": "Username inválido. Deve conter apenas letras, números e underscore."
    }
    ```

## Scripts Disponíveis

- `npm run dev` - Executa o servidor em modo de desenvolvimento com hot reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa o servidor compilado

## Estrutura do Projeto

```
src/
├── config/
│   └── env.ts          # Configurações de ambiente
├── middleware/
│   └── error.ts        # Middleware de tratamento de erros
├── routes/
│   └── health.ts       # Rotas de health check
├── app.ts              # Configuração do Express
└── server.ts           # Inicialização do servidor
```