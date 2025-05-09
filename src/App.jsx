import TriviaGame from './components/TriviaGame';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 mb-4 mt-2">
        Trivia con IA
      </h1>
      <TriviaGame />
    </div>
  );
}

export default App;
