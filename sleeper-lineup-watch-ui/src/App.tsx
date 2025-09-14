import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Footer from './components/Footer'

// Interface para tipagem dos dados dos jogadores
interface League {
  league_id: string
  name: string
}

interface QuestionablePlayer {
  player_id: string
  full_name: string
  position: string
  team: string
  injury_status: string
}

interface LeagueData {
  league: League
  questionable_starters: QuestionablePlayer[]
}

interface Player {
  league: string
  player: string
  position: string
  team: string
  status: string
}

function App() {
  // Estados do componente
  const [username, setUsername] = useState<string>('')
  const [data, setData] = useState<Player[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  
  // Estados dos filtros
  const [selectedLeague, setSelectedLeague] = useState<string>('all')
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // useEffect para carregar dados salvos do localStorage na inicialização
  useEffect(() => {
    // Carregar username salvo
    const savedUsername = localStorage.getItem('lastUsername')
    if (savedUsername) {
      setUsername(savedUsername)
    }

    // Carregar filtros salvos
    const savedLeague = localStorage.getItem('lastLeague')
    if (savedLeague) {
      setSelectedLeague(savedLeague)
    }

    const savedPosition = localStorage.getItem('lastPosition')
    if (savedPosition) {
      setSelectedPosition(savedPosition)
    }

    const savedStatus = localStorage.getItem('lastStatus')
    if (savedStatus) {
      setSelectedStatus(savedStatus)
    }
  }, [])

  // useEffect para salvar filtros no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('lastLeague', selectedLeague)
  }, [selectedLeague])

  useEffect(() => {
    localStorage.setItem('lastPosition', selectedPosition)
  }, [selectedPosition])

  useEffect(() => {
    localStorage.setItem('lastStatus', selectedStatus)
  }, [selectedStatus])

  // Função para buscar jogadores duvidosos
  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Por favor, insira um nome de usuário')
      return
    }

    // Salvar username no localStorage
    localStorage.setItem('lastUsername', username.trim())

    setLoading(true)
    setError('')
    setData([])

    try {
      const response = await axios.get(
        `http://localhost:3000/sleeper/user/${username}/questionable`
      )
      
      // Transforma os dados da API no formato esperado pela tabela
      const transformedData: Player[] = []
      
      response.data.forEach((leagueData: LeagueData) => {
        leagueData.questionable_starters.forEach((player: QuestionablePlayer) => {
          transformedData.push({
            league: leagueData.league.name,
            player: player.full_name,
            position: player.position,
            team: player.team,
            status: player.injury_status
          })
        })
      })
      
      setData(transformedData)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Usuário não encontrado no Sleeper')
      } else if (err.response?.status === 500) {
        setError('Erro interno do servidor')
      } else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError('Não foi possível conectar ao servidor')
      } else {
        setError('Erro ao buscar dados. Verifique se o backend está rodando.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Função para lidar com Enter no input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Função para determinar a classe CSS do status de lesão
  const getStatusBadgeClass = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    if (normalizedStatus === 'questionable') return 'badge badge-status-questionable'
    if (normalizedStatus === 'doubtful') return 'badge badge-status-doubtful'
    if (normalizedStatus === 'out') return 'badge badge-status-out'
    if (normalizedStatus === 'ir') return 'badge badge-status-ir'
    if (normalizedStatus === 'sus' || normalizedStatus === 'susp') return 'badge badge-status-sus'
    if (normalizedStatus === 'pup') return 'badge badge-status-pup'
    if (normalizedStatus === 'na') return 'badge badge-status-na'
    if (normalizedStatus === 'dnr') return 'badge badge-status-dnr'
    if (normalizedStatus === 'cov') return 'badge badge-status-cov'
    if (normalizedStatus === 'nfi-r' || normalizedStatus === 'nfi-a') return 'badge badge-status-nfi-r'
    if (normalizedStatus === 'cel') return 'badge badge-status-cel'
    return 'badge badge-status-questionable' // padrão para outros status
  }

  return (
    <div className="container">
      <h1>Sleeper Lineup Watch</h1>
      <p>Consulte jogadores titulares duvidosos por usuário do Sleeper</p>
      
      {/* Formulário de busca */}
      <div className="search-form">
        <input
          type="text"
          placeholder="Digite o nome de usuário do Sleeper"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading || !username.trim()}
        >
          {loading ? 'Buscando...' : 'Buscar jogadores'}
        </button>
      </div>

      {/* Exibição de erro */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Spinner de loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando jogadores duvidosos...</p>
        </div>
      )}

      {/* Landing page inicial - exibida quando não há dados e nenhuma busca foi feita */}
      {!loading && !error && data.length === 0 && !username && (
        <div className="landing-page">
          <h2>Bem-vindo ao Sleeper Lineup Watch</h2>
          <p>Consulte facilmente quais titulares estão com status duvidoso em todas as suas ligas no Sleeper.</p>
          <p>Digite seu username do Sleeper acima e clique em 'Buscar jogadores'.</p>
        </div>
      )}

      {/* Tabela de resultados */}
      {!loading && data.length > 0 && (
        <div>
          <h2>Jogadores Duvidosos - {username}</h2>
          
          {/* Filtros */}
          <div className="filters">
            <select 
              value={selectedLeague} 
              onChange={(e) => setSelectedLeague(e.target.value)}
            >
              <option value="all">Todas as Ligas</option>
              {Array.from(new Set(data.map(player => player.league))).map(league => (
                <option key={league} value={league}>{league}</option>
              ))}
            </select>
            
            <select 
              value={selectedPosition} 
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="all">Todas as Posições</option>
              <option value="QB">QB</option>
              <option value="RB">RB</option>
              <option value="WR">WR</option>
              <option value="TE">TE</option>
              <option value="K">K</option>
              <option value="DEF">DEF</option>
              <option value="DL">DL (Defensive Line)</option>
              <option value="LB">LB (Linebacker)</option>
              <option value="DB">DB (Defensive Back)</option>
            </select>
            
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="Questionable">Questionable</option>
              <option value="Doubtful">Doubtful</option>
              <option value="Out">Out</option>
              <option value="IR">IR (Injured Reserve)</option>
              <option value="SUS">SUS (Suspended)</option>
              <option value="SUSP">SUSP (Suspended)</option>
              <option value="PUP">PUP (Physically Unable to Perform)</option>
              <option value="NA">NA (Not Active)</option>
              <option value="DNR">DNR (Did Not Report)</option>
              <option value="COV">COV (COVID-19)</option>
              <option value="NFI-R">NFI-R (Non-Football Injury Reserve)</option>
              <option value="NFI-A">NFI-A (Non-Football Injury Active)</option>
              <option value="CEL">CEL (Commissioner's Exempt List)</option>
            </select>
          </div>
          
          <div className="cards-container">
            {data
              .filter(player => {
                // Filtro por liga
                if (selectedLeague !== 'all' && player.league !== selectedLeague) {
                  return false
                }
                // Filtro por posição
                if (selectedPosition !== 'all' && player.position !== selectedPosition) {
                  return false
                }
                // Filtro por status
                if (selectedStatus !== 'all' && player.status !== selectedStatus) {
                  return false
                }
                return true
              })
              .map((player, index) => (
                <div key={index} className="card">
                  <div className="league-name">{player.league}</div>
                  <div className="player-name">{player.player}</div>
                  <div style={{ marginBottom: '8px' }}>
                    <span className="badge badge-position">{player.position}</span>
                    <span className="badge badge-team">{player.team}</span>
                  </div>
                  <div>
                    <span className={getStatusBadgeClass(player.status)}>{player.status}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há dados após busca */}
      {!loading && !error && data.length === 0 && username && (
        <div className="empty">
          Nenhum jogador duvidoso encontrado para o usuário "{username}"
        </div>
      )}
      
      {/* Footer fixo */}
      <Footer />
    </div>
  )
}

export default App