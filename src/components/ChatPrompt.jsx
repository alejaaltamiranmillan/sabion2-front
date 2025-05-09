import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa'

const ChatPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const conversationsEndRef = useRef(null)
  const textareaRef = useRef(null)

  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const topics = ['Historia', 'Ciencia', 'Deportes', 'Arte', 'Tecnología'];

  const startTrivia = async () => {
    try {
      const res = await axios.post('/api/chat/trivia', { topic });
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

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    if (conversationsEndRef.current) {
      conversationsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversations])

  // Agregar manejador de tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevenir el salto de línea por defecto
      handleSubmit(e); // Enviar el mensaje
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim()) return
    
    try {
      setIsLoading(true)
      
      // Agregar el prompt del usuario a las conversaciones
      const newConversations = [
        ...conversations, 
        { role: 'user', content: prompt }
      ]
      setConversations(newConversations)
      setPrompt('') // Limpiar el input inmediatamente para mejor UX
      
      const res = await axios.post('https://chatgptback.vercel.app/api/chat', { prompt })
      
      // Agregar la respuesta de la IA a las conversaciones
      setConversations([
        ...newConversations,
        { role: 'assistant', content: res.data.response }
      ])
    } catch (error) {
      console.error('Error al obtener respuesta:', error)
      setConversations([
        ...conversations,
        { role: 'user', content: prompt },
        { role: 'system', content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo. 😕' }
      ])
      setPrompt('')
    } finally {
      setIsLoading(false)
      // Enfocar el textarea después de enviar
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }

  // Función para formatear el texto con saltos de línea
  const formatText = (text) => {
    // Divide el texto en párrafos y los une con saltos de línea en JSX
    return text.split('\n').map((paragraph, i) => (
      <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
    ));
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
    <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-purple-200 mx-auto max-w-2xl">
      {/* Header del chat */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-center shadow-md">
        <h2 className="text-xl font-bold flex items-center justify-center">
          <FaRobot className="mr-2 text-purple-200" /> ChatGPT App
        </h2>
      </div>
      
      {/* Historial de conversaciones con mejor formateo - Altura fija */}
      <div className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-purple-50 to-white">
        {conversations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600">
            <div className="p-6 bg-purple-100 rounded-full mb-4 shadow-inner">
              <FaRobot className="text-5xl text-purple-600" />
            </div>
            <p className="text-xl font-semibold text-purple-800">¡Bienvenido al Chat! 👋</p>
            <p className="mt-2 text-purple-600">¿En qué puedo ayudarte hoy?</p>
          </div>
        ) : (
          <div className="space-y-5">
            {conversations.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl shadow-md ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-none' 
                      : message.role === 'system'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-white text-gray-800 border border-purple-100 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="flex items-center mb-1 font-medium">
                    {message.role === 'user' ? (
                      <>
                        <FaUser className="mr-1 text-white" /> <span className="text-white font-bold">Tú</span>
                      </>
                    ) : message.role === 'system' ? (
                      'Sistema'
                    ) : (
                      <>
                        <FaRobot className="mr-1 text-purple-600" /> <span className="text-purple-800">ChatGPT</span>
                      </>
                    )}
                  </div>
                  <div className={`whitespace-pre-wrap leading-relaxed text-sm md:text-base ${message.role === 'user' ? 'font-medium text-white' : ''}`}>
                    {formatText(message.content)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={conversationsEndRef} />
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start mt-4">
            <div className="max-w-[85%] p-3 bg-white border border-purple-100 rounded-2xl rounded-tl-none shadow-md">
              <div className="flex items-center mb-1 font-medium">
                <FaRobot className="mr-1 text-purple-600" /> <span className="text-purple-800">ChatGPT</span>
              </div>
              <div className="flex space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Formulario para enviar el prompt - Botón debajo del texto */}
      <form onSubmit={handleSubmit} className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 border-t border-purple-200">
        <div className="mb-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje aquí..."
            className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 resize-none shadow-inner transition-all"
            rows="2"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            <FaPaperPlane className="mr-2" /> Enviar
          </button>
        </div>
        
        <p className="text-xs text-purple-500 mt-1 text-center">
          {isLoading ? '⏳ Procesando...' : '💬 Presiona Enter para enviar'}
        </p>
      </form>

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
  )
}

export default ChatPrompt
