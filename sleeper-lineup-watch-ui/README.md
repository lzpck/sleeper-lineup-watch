# Sleeper Lineup Watch UI

Frontend minimalista em React + Vite + TypeScript para consultar jogadores titulares duvidosos do Sleeper Fantasy Football.

## Funcionalidades

- Interface dark mode moderna e responsiva
- Busca por nome de usuário do Sleeper
- Exibição de jogadores duvidosos em tabela estilizada
- **Filtros dinâmicos** para refinar resultados:
  - **Liga**: Restringe jogadores por liga específica
  - **Posição**: Permite visualizar apenas QBs, RBs, WRs, TEs, Ks ou DEFs
  - **Status**: Filtra por status de lesão (Questionable, Doubtful, Out)
- **Persistência automática no localStorage**:
  - **Último username buscado**: Automaticamente preenchido ao recarregar a página
  - **Última liga selecionada**: Filtro de liga é mantido entre sessões
  - **Última posição escolhida**: Filtro de posição é preservado
  - **Último status filtrado**: Filtro de status é salvo localmente
  - Dados são salvos automaticamente no navegador via localStorage
- **Spinner animado** durante carregamento
- **Mensagens de erro amigáveis** com diferentes cenários:
  - "Usuário não encontrado no Sleeper"
  - "Não foi possível conectar ao servidor"
  - Outros erros de conexão
- **Aviso quando não há jogadores duvidosos** encontrados
- Tratamento completo de estados de loading e erro
- Integração com API backend local

## Tecnologias

- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Axios** - Cliente HTTP para requisições
- **CSS** - Estilos customizados em dark mode

## Instalação e Uso

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend `sleeper-lineup-watch` rodando em `http://localhost:3000`

### Passos

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:5173
   ```

4. **Usar a aplicação:**
   - Insira o nome de usuário do Sleeper no campo de busca
   - Clique em "Buscar jogadores" ou pressione Enter
   - Visualize os jogadores duvidosos na tabela
   - Use os filtros para refinar os resultados:
     - **Liga**: Selecione uma liga específica ou "Todas as Ligas"
     - **Posição**: Filtre por posição (QB, RB, WR, TE, K, DEF) ou "Todas as Posições"
     - **Status**: Filtre por status de lesão ou "Todos os Status"

### Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção

## Estrutura do Projeto

```
sleeper-lineup-watch-ui/
├── src/
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── index.html           # Template HTML
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração TypeScript
├── vite.config.ts       # Configuração Vite
└── README.md           # Este arquivo
```

## API Integration

A aplicação consome o endpoint:
```
GET http://localhost:3000/sleeper/user/:username/questionable
```

Retorna array de objetos com:
- `league`: Nome da liga
- `player`: Nome do jogador
- `position`: Posição do jogador
- `team`: Time do jogador
- `status`: Status atual (Questionable, Doubtful, etc.)