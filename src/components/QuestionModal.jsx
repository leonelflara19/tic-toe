import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti'; // Importar la librería de confeti
import { CategoryFilter } from './CategoryFilter';

export const QuestionModal = ({ isOpen, onClose, onCorrectAnswer, onIncorrectAnswer, activePlayer }) => {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null); // Añadir estado para el formato

  useEffect(() => {
    if (isOpen && isGameStarted && !hasFetched && selectedCategory) {
      const baseUrl = `https://api.quiz-contest.xyz/questions?limit=1&page=${page}&category=${selectedCategory}`;

      // Llamar a la API con el filtro de categoría, formato, y número de página
      fetch(baseUrl, {
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
            setPage((prevPage) => prevPage + 1);
            setHasFetched(true);
          } else {
            console.error('No hay preguntas disponibles para esta categoría.');
          }
        })
        .catch((error) => {
          console.error('Error al obtener la pregunta:', error);
        });
    }
  }, [isOpen, hasFetched, page, selectedCategory, isGameStarted, selectedFormat]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === questionData.correct_answer) {
      // Mostrar confeti cuando la respuesta es correcta
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        duration: 3000, // Duración de la animación de confeti en milisegundos (3 segundos)
      });
      onCorrectAnswer(); // Llamar a la función de respuesta correcta
    } else {
      onIncorrectAnswer(); // Llamar a la función de respuesta incorrecta
    }
    setHasFetched(false);
    setSelectedAnswer('');
    setQuestionData(null);
    onClose();
  };

  const startGame = () => {
    setIsGameStarted(true);
    setPage(1);
    setHasFetched(false);
    setQuestionData(null);
  };

  if (!isOpen) return null;

  if (!isGameStarted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            startGame={startGame}
            setSelectedFormat={setSelectedFormat} // Añadir el set de formato aquí
          />
        </div>
      </div>
    );
  }

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
                borderColor: selectedAnswer === answer ? '#000' : '#ccc',
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
