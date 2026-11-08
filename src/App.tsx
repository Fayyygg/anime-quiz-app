import { useState, useEffect } from 'react';

const questions = [
  { image: '/naruto.png', options: ['Наруто', 'Блич', 'Ван Пис', 'Атака Титанов'], correct: 'Наруто' },
  { image: '/titan.png', options: ['Наруто', 'Блич', 'Ван Пис', 'Атака Титанов'], correct: 'Атака Титанов' },
  { image: '/onepiece.png', options: ['Наруто', 'Блич', 'Ван Пис', 'Атака Титанов'], correct: 'Ван Пис' }
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // Таймер на 15 секунд
  
  const userName = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'Гость';
  const question = questions[currentQuestionIndex];

  // Логика таймера
  useEffect(() => {
    // Если ответ уже дан или игра окончена, таймер останавливается
    if (selectedAnswer !== null || isGameOver) return;

    if (timeLeft === 0) {
      // Время вышло - засчитываем как неправильный ответ
      setSelectedAnswer("Время вышло");
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, selectedAnswer, isGameOver]);

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === question.correct) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(15); // Сбрасываем таймер
    } else {
      setIsGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(15);
  };

  // Красивые стили для кнопок
  const getButtonStyle = (opt: string) => {
    const baseStyle: React.CSSProperties = {
      padding: '18px 20px', 
      fontSize: 18, 
      cursor: 'pointer', 
      borderRadius: 12,
      border: 'none', 
      background: '#2c2c2e', 
      color: 'white', 
      transition: 'all 0.2s ease',
      fontWeight: '600',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      width: '100%',
      textAlign: 'center',
    };

    if (selectedAnswer === null) return baseStyle;
    
    // Подсветка правильного/неправильного
    if (opt === question.correct) {
      return { ...baseStyle, background: '#34c759', boxShadow: '0 4px 6px rgba(52, 199, 89, 0.4)' };
    }
    if (opt === selectedAnswer && selectedAnswer !== question.correct) {
      return { ...baseStyle, background: '#ff3b30', boxShadow: '0 4px 6px rgba(255, 59, 48, 0.4)' };
    }
    // Остальные тускнеют
    return { ...baseStyle, opacity: 0.4, boxShadow: 'none' };
  };

  if (isGameOver) {
    const botUrl = "https://t.me/guess_the_an1me_bot"; // Ссылка на твой бот
    const shareText = `Я угадал ${score} из ${questions.length} аниме! Слабо повторить? 🎮`;
    
    // Получаем доступ к Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;

    // Функция для шаринга
    const handleShare = () => {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`;
      
      // Пытаемся открыть через официальный API Telegram
      if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(shareUrl);
      } 
      // Если API недоступно (например, мы смотрим через CloudPub-ссылку в браузере), 
      // пробуем открыть через window.open
      else {
        window.open(shareUrl, '_blank');
      }
    };

    // Функция для приглашения друга (открывает список контактов)
    const handleInvite = () => {
      if (tg && tg.switchInlineQuery) {
        tg.switchInlineQuery("Сыграем в Угадай Аниме? 🎮", ["users", "groups"]);
      } else {
        handleShare(); 
      }
    };

    return (
      <div style={{ padding: 20, fontFamily: 'system-ui, -apple-system, sans-serif', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '90vh' }}>
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>Игра окончена!</h1>
        <h2 style={{ color: '#888', fontSize: 20 }}>Твой результат:</h2>
        <div style={{ fontSize: 72, fontWeight: 'bold', color: '#34c759', margin: '20px 0', textShadow: '0 0 20px rgba(52, 199, 89, 0.5)' }}>
          {score} <span style={{ fontSize: 40, color: '#555' }}>/ {questions.length}</span>
        </div>
        <p style={{ fontSize: 18, marginBottom: 30 }}>Отличная работа, {userName}!</p>
        
        {/* Кнопка Поделиться */}
        <button 
          onClick={handleShare} 
          style={{ marginBottom: 15, padding: '18px 30px', fontSize: 18, cursor: 'pointer', borderRadius: 12, border: 'none', background: '#0088cc', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0, 136, 204, 0.4)' }}
        >
          📤 Поделиться результатом
        </button>

        {/* Кнопка Пригласить друга */}
        <button 
          onClick={handleInvite} 
          style={{ marginBottom: 30, padding: '18px 30px', fontSize: 18, cursor: 'pointer', borderRadius: 12, border: '1px solid #34c759', background: 'transparent', color: '#34c759', fontWeight: 'bold' }}
        >
          👥 Пригласить друга
        </button>
        
        {/* Кнопка Играть снова */}
        <button 
          onClick={restartGame} 
          style={{ padding: '18px 30px', fontSize: 18, cursor: 'pointer', borderRadius: 12, border: 'none', background: '#2c2c2e', color: 'white', fontWeight: 'bold' }}
        >
          🔄 Играть снова
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, -apple-system, sans-serif', textAlign: 'center', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Шапка с прогрессом и таймером */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, background: '#1c1c1e', padding: '10px 15px', borderRadius: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 'bold' }}>Вопрос {currentQuestionIndex + 1}/{questions.length}</span>
        <span style={{ fontSize: 16, color: '#888' }}>Очки: {score}</span>
        <span style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          color: timeLeft <= 5 ? '#ff3b30' : '#34c759', // Краснеет, когда остается 5 сек
          background: '#000', padding: '4px 12px', borderRadius: 20
        }}>
          ⏱ {timeLeft}
        </span>
      </div>

      <img src={question.image} alt="Кадр" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: 16, marginBottom: 20, border: '2px solid #333' }} />

      <div style={{ display: 'grid', gap: 12, flexGrow: 1 }}>
        {question.options.map((opt) => (
          <button key={opt} onClick={() => handleAnswer(opt)} style={getButtonStyle(opt)} disabled={selectedAnswer !== null}>
            {opt}
          </button>
        ))}
      </div>

      {selectedAnswer !== null && (
        <button onClick={handleNextQuestion} style={{ marginTop: 20, padding: '18px 30px', fontSize: 18, cursor: 'pointer', borderRadius: 12, border: 'none', background: '#0088cc', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0, 136, 204, 0.4)' }}>
          {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Показать результат'}
        </button>
      )}
    </div>
  );
}

export default App;