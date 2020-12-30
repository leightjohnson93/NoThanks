import { useEffect, useState } from 'react'
import { withFirebase } from './Firebase'
import PlayingCard from './PlayingCard'
import './App.css'

const createDeck = () => {
  const deck = Array.from({ length: 33 }, (_, i) => i + 3)
  while (deck.length > 24) {
    const i = Math.floor(Math.random() * deck.length)
    deck.splice(i, 1)
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

const AppBase = ({ firebase }: { firebase: any }) => {
  const [name, setName] = useState('Leight')
  const [gameState, setGameState] = useState<any>()

  useEffect(() => {
    firebase.db.ref('games/public').on('value', (snapshot: any) => setGameState(snapshot.val()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nextTurn = () => {
    const names = Object.keys(gameState.players)
    for (let i = 0; i < names.length; i++) {
      const currentPlayer = gameState.players[names[i]]
      const nextPlayer =
        names.length - 1 !== i ? gameState.players[names[i + 1]] : gameState.players[names[0]]
      if (currentPlayer.turn) {
        currentPlayer.turn = false
        nextPlayer.turn = true
        console.log(names)
        return
      }
    }
  }

  const takeCard = () => {
    const activeCard = gameState.deck[gameState.deck.length - 1]
    const player = gameState.players[name]
    player.cards ? player.cards.push(activeCard) : (player.cards = [activeCard])
    player.chips += gameState.chipsOnCard
    gameState.deck = gameState.deck.filter((card: number) => card !== activeCard)
    gameState.chipsOnCard = 0
    nextTurn()
    firebase.db.ref('games/public').set(gameState)
  }

  const noThanks = () => {
    gameState.players[name].chips--
    gameState.chipsOnCard++
    nextTurn()
    firebase.db.ref('games/public').set(gameState)
  }

  const arrangePlayerCards = () => {
    const runs: number[][] = []
    if (!name) {
      return runs
    }
    const cards = gameState.players[name].cards
    const sortedCards = cards ? cards.sort((a: number, b: number) => a - b) : []
    let run = []
    for (let i = 1; i <= sortedCards.length; i++) {
      if (run.length === 0) {
        run.push(sortedCards[i - 1])
      }
      if (sortedCards[i] - sortedCards[i - 1] === 1) {
        run.push(sortedCards[i])
      } else {
        runs.push(run)
        run = []
      }
    }
    return runs
  }

  const getScore = () => {
    return (
      arrangePlayerCards().reduce((sum, run) => sum + run[0], 0) - gameState.players[name].chips
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <button onClick={firebase.createGame}>Create Game</button> */}
        <div>Players</div>
        {gameState &&
          gameState.players &&
          Object.keys(gameState.players).map((name: string) => <span key={name}>{name}</span>)}
        {gameState && gameState.inProgress ? (
          <>
            <PlayingCard
              card={gameState.deck[gameState.deck.length - 1]}
              chips={gameState.chipsOnCard}
            />
            <div>Chips Remaining: {gameState && gameState.players[name].chips}</div>
            {arrangePlayerCards().map((runs) => (
              <span key={runs[0]}>{runs.join('|')}</span>
            ))}
            <button disabled={!gameState.deck || !gameState.players[name].turn} onClick={takeCard}>
              Take Card
            </button>
            <button
              disabled={
                !gameState.deck || !gameState.players[name].turn || !gameState.players[name].chips
              }
              onClick={noThanks}
            >
              No, Thanks!
            </button>
            <div>Score: {getScore()}</div>
          </>
        ) : (
          <>
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <button disabled={!name} onClick={() => firebase.joinGame(name)}>
              Join
            </button>
            <button
              disabled={!gameState?.players}
              onClick={() => {
                const names = Object.keys(gameState.players)
                gameState.players[names[Math.floor(names.length * Math.random())]].turn = true
                gameState.deck = createDeck()
                gameState.inProgress = true
                gameState.chipsOnCard = 0
                firebase.db.ref('games/public').set(gameState)
              }}
            >
              Start
            </button>
          </>
        )}
        <button onClick={() => firebase.db.ref('games/public').remove()}>Reset</button>
      </header>
    </div>
  )
}

const App = withFirebase(AppBase)
export default App
