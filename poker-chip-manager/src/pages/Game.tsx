import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { Player, GameState, Round } from '../types'

const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    pot: 0,
    currentTurn: '',
    round: Round.PreFlop,
    currentBet: 0,
    dealerPosition: 0,
    lastPlayerToAct: 0,
    smallBlind: 0,
    bigBlind: 0
  })
  const [playerName, setPlayerName] = useState<string>('')
  const [betAmount, setBetAmount] = useState<number>(0)

  useEffect(() => {
    console.log('Game component mounted')
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    let name = location.state?.playerName
    if (!name) {
      name = prompt("Enter your name") || `Player${Math.floor(Math.random() * 1000)}`
    }
    setPlayerName(name)

    console.log(`Joining game ${id} as ${name}`)
    newSocket.emit('joinGame', id, name)

    newSocket.on('updateGameState', (updatedGameState: GameState) => {
      console.log('Received updated game state:', updatedGameState)
      setGameState(updatedGameState)
      // Reset bet amount when it's not player's turn
      if (updatedGameState.currentTurn !== newSocket.id) {
        setBetAmount(0)
      }
    })

    return () => {
      console.log('Game component unmounting, closing socket')
      newSocket.close()
    }
  }, [id, location.state])

  const placeBet = () => {
    if (socket && betAmount > 0) {
      console.log(`Placing bet: ${betAmount}`)
      socket.emit('placeBet', { roomId: id, amount: betAmount })
      setBetAmount(0)
    }
  }

  const check = () => {
    if (socket) {
      console.log('Checking')
      socket.emit('check', id)
    }
  }

  const fold = () => {
    if (socket) {
      console.log('Folding')
      socket.emit('fold', id)
    }
  }

  const isPlayerTurn = () => {
    return gameState.currentTurn === socket?.id
  }

  const currentPlayer = gameState.players.find(p => p.id === socket?.id)

  const getPlayerPosition = (index: number) => {
    if (index === gameState.dealerPosition) return 'D';
    if (index === (gameState.dealerPosition + 1) % gameState.players.length) return 'SB';
    if (index === (gameState.dealerPosition + 2) % gameState.players.length) return 'BB';
    return '';
  }

  const getMinBet = () => {
    if (!currentPlayer) return 0;
    return Math.max(gameState.currentBet - currentPlayer.betThisRound, 0);
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Game Room: {id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Your Info</h3>
            <p>Name: {playerName}</p>
            <p>Chips: {currentPlayer?.chips || 0}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Game Info</h3>
            <p>Current Round: {gameState.round}</p>
            <p>Current Bet: {gameState.currentBet}</p>
            <p>Current Pot: {gameState.pot}</p>
          </div>
        </div>
      </div>
      <div className="my-4">
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          min={getMinBet()}
          max={currentPlayer?.chips || 0}
          className="input input-bordered w-full max-w-xs mr-2"
        />
        <button 
          className="btn btn-primary mr-2" 
          onClick={placeBet} 
          disabled={!isPlayerTurn() || betAmount < getMinBet()}
        >
          {getMinBet() > 0 ? 'Call/Raise' : 'Bet'}
        </button>
        <button 
          className="btn btn-secondary mr-2" 
          onClick={check} 
          disabled={!isPlayerTurn() || getMinBet() > 0}
        >
          Check
        </button>
        <button 
          className="btn btn-accent" 
          onClick={fold} 
          disabled={!isPlayerTurn()}
        >
          Fold
        </button>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Players</h3>
          <ul>
            {gameState.players.map((player: Player, index: number) => (
              <li key={player.id} className="mb-2">
                <span className={`${player.id === gameState.currentTurn ? 'font-bold' : ''}`}>
                  {player.name}: {player.chips} chips
                  {player.folded ? " (Folded)" : ""}
                  {player.id === gameState.currentTurn && " (Current Turn)"}
                  {` ${getPlayerPosition(index)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Game