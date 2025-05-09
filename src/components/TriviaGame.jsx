import { useState } from 'react';
import axios from 'axios';

const TriviaGame = () => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const topics = ['Historia', 'Ciencia', 'Deportes', 'Arte', 'Tecnología'];

  const startTrivia = async () => {
    try {
      const res = await axios.post('https://sabion2-back.vercel.app/api/chat/trivia', { topic });
      setQuestions(res.data.questions);
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Resultados</h2>
        <p>Correctas: {score}</p>
        <p>Incorrectas: {questions.length - score}</p>
      </div>
    );
  }

  if (questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div>
        <h2 className="text-xl font-bold">{currentQuestion.question}</h2>
        <div>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.isCorrect)}
              className="block p-2 m-2 bg-purple-500 text-white rounded"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {!name ? (
        <div>
          <h2 className="text-xl font-bold">Ingresa tu nombre</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      ) : !topic ? (
        <div>
          <h2 className="text-xl font-bold">Selecciona un tema</h2>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="block p-2 m-2 bg-blue-500 text-white rounded"
            >
              {t}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={startTrivia} className="p-2 bg-green-500 text-white rounded">
          Comenzar Trivia
        </button>
      )}
    </div>
  );
};

export default TriviaGame;