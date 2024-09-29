import React, { useEffect, useState } from 'react';

// Función para limpiar caracteres especiales
const cleanText = (text) => {
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(text, "text/html").documentElement.textContent;
  return decodedString;
};

export const QuestionModal = ({ isOpen, onClose, onCorrectAnswer, onIncorrectAnswer }) => {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('https://opentdb.com/api.php?amount=1')
        .then((response) => response.json())
        .then((data) => {
          setQuestionData(data.results[0]);
          setSelectedAnswer(''); // Reset selected answer on new question
        });
    }
  }, [isOpen]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === questionData.correct_answer) {
      onCorrectAnswer();
    } else {
      onIncorrectAnswer(); // Llama a onIncorrectAnswer si la respuesta es incorrecta
    }
    onClose();
  };

  if (!isOpen || !questionData) return null;

  const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer].sort();

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{cleanText(questionData.question)}</h2> {/* Limpiamos la pregunta */}
        <div className="answers">
          {allAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelection(answer)}
              style={{ backgroundColor: selectedAnswer === answer ? '#f4f6f7'  : '' }} // Resaltar respuesta seleccionada
            >
              {cleanText(answer)} {/* Limpiamos la respuesta */}
            </button>
          ))}
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};
