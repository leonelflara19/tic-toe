import React, { useEffect, useState } from 'react';
import { CategoryFilter } from './CategoryFilter';

// Componente del modal de la pregunta
export const QuestionModal = ({ isOpen, onClose, onCorrectAnswer, onIncorrectAnswer, activePlayer }) => {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para la categoría seleccionada
  const [hasFetched, setHasFetched] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (isOpen && isGameStarted && !hasFetched && selectedCategory) {
      // Llamar a la API de Quiz Contest con el filtro de categoría y número de página dinámico
      fetch(`https://api.quiz-contest.xyz/questions?limit=1&page=${page}&category=${selectedCategory}`, {
        headers: {
          'Authorization': '$2b$12$3Ts419AMUySDKlRYK8Q59eKQkfgTs1dCpmwamsGk5pkaPKadJLB9S',
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.questions.length > 0) {
            const question = data.questions[0];
            setQuestionData({
              question: question.question,
              correct_answer: question.correctAnswers,
              incorrect_answers: question.incorrectAnswers,
            });
            setSelectedAnswer('');
            setPage((prevPage) => prevPage + 1); // Incrementar la página para la próxima pregunta
            setHasFetched(true); // Marcar que la solicitud ya se hizo
          } else {
            console.error('No hay preguntas disponibles para esta categoría.');
          }
        })
        .catch((error) => {
          console.error('Error al obtener la pregunta:', error);
        });
    }
  }, [isOpen, hasFetched, page, selectedCategory, isGameStarted]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === questionData.correct_answer) {
      onCorrectAnswer();
    } else {
      onIncorrectAnswer();
    }
    setHasFetched(false); // Reseteamos el estado para permitir la próxima llamada cuando se abra de nuevo
    setSelectedAnswer('');
    setQuestionData(null); // Reiniciar la pregunta para la siguiente
    onClose(); // Cerrar el modal después de enviar la respuesta
  };

  const startGame = () => {
    setIsGameStarted(true);
    setPage(1);
    setHasFetched(false);
    setQuestionData(null);
  };

  if (!isOpen) return null;

  // Mostrar solo el filtro de categoría si el juego no ha comenzado
  if (!isGameStarted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} startGame={startGame} />
        </div>
      </div>
    );
  }

  // Mostrar preguntas una vez que el juego ha comenzado
  if (!questionData) return <p>Cargando pregunta...</p>;

  const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer].sort();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{questionData.question}</h2>
        <div className="answers">
          {allAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelection(answer)}
              style={{
                backgroundColor: selectedAnswer === answer ? '#f4f6f7' : '#fff',
                color: selectedAnswer === answer ? '#000' : '#000',
                borderColor: selectedAnswer === answer ? '#000' : '#ccc'
              }}
            >
              {answer}
            </button>
          ))}
        </div>
        <button onClick={handleSubmit} style={{ color: '#040101' }}>Submit</button>
      </div>
    </div>
  );
};
