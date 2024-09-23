import { useState } from 'react'
import './App.css'
import { Squared } from './components/Squared'
import confetti from 'canvas-confetti'




const TURN = {
  X: 'X',
  O: 'O'
}

const WINNER_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 4, 8], // left diagonal
  [2, 4, 6], // right diagonal
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8]  // right column
]

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(TURN.X)
  const [winner, setWinner] = useState(null)



  const checkWinner = (boardToCheck) =>{
    for(let combo of WINNER_COMBINATIONS){
      const [a, b, c] = combo
      if (boardToCheck[a] && 
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c])
        {
          return boardToCheck[a]
        }
    }
    return null

  }
  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURN.X)
    setWinner(null)
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every(squared => squared !== null)
  }


  const updatedBoard = (index) => {
    const newBoard = [...board]
    if (board[index] || winner) return
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURN.X ? TURN.O : TURN.X
    setTurn(newTurn)
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      confetti()
    }else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <>
      <main className='board'>
        <div><a href='https://juegoserice.wordpress.com/juegos-de-estrategia/tic-tac-toe/' target='_blank'>Tic tac toe</a></div>
        <button onClick={resetGame}>Resetear Juego</button>
        <section className='game'>
          {
            board.map((_, index) =>{
              return(
                <Squared key={index} index={index}>
                  {board[index]}
                </Squared>
              )
            })
          }
        </section>
        

        <section className='turn'>
          <Squared isSelected={turn === TURN.X}>
            {TURN.X}
          </Squared>
          <Squared isSelected={turn === TURN.O}>
            {TURN.O} 
          </Squared>
        </section>

        {
          winner !== null && (
            <section className='winner'>
            <div className='text'>
             <h2>
              {
                winner === false ? 'Empate' : `Ganó:`
              }
             </h2>

             <header className='win'>
              {winner && <Squared>{winner}</Squared>}
             </header>

             <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
             </footer>
            </div>
            </section>
          )
        }

      </main>

    </>
  )
}

export default App
