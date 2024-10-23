import { useState } from 'react';
import './App.css';
import { Squared } from './components/Squared';
import { QuestionModal } from './components/QuestionModal';
import confetti from 'canvas-confetti';

const TURN = {
  X: 'X',
  O: 'O',
};

const WINNER_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURN.X);
  const [winner, setWinner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const checkWinner = (boardToCheck) => {
    for (let combo of WINNER_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURN.X);
    setWinner(null);
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  const handleSquareClick = (index) => {
    if (board[index] || winner) return;
    setPendingMove(index);
    setIsModalOpen(true);
  };

  const handleCorrectAnswer = () => {
    const newBoard = [...board];
    newBoard[pendingMove] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURN.X ? TURN.O : TURN.X;
    setTurn(newTurn);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      triggerConfetti();
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + (3 * 1000); // Confeti por 3 segundos
    const colors = ['#bb0000', '#ffffff']; // Colores personalizados

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleIncorrectAnswer = () => {
    const newTurn = turn === TURN.X ? TURN.O : TURN.X;
    setTurn(newTurn);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <main className="board">
        <h1>Tic Tac Toe</h1>
        <button onClick={resetGame}>Resetear Juego</button>
        {/* <button className="toggle" onClick={toggleDarkMode}>
          {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button> */}
        <section className="game">
          {board.map((_, index) => (
            <Squared key={index} index={index} updatedBoard={() => handleSquareClick(index)}>
              {board[index]}
            </Squared>
          ))}
        </section>

        <section className="turn">
          <Squared isSelected={turn === TURN.X} color="blue">{TURN.X}</Squared>
          <Squared isSelected={turn === TURN.O} color="red">{TURN.O}</Squared>
        </section>

        {winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? 'Empate' : `Ganó: ${winner}`}</h2>
              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )}

        <QuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCorrectAnswer={handleCorrectAnswer}
          onIncorrectAnswer={handleIncorrectAnswer}
        />
      </main>
    </div>
  );
}

export default App;
