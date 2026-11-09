import { useState, useEffect } from 'react';

const questions = [
  { image: '/naruto.png', options: ['Наруто', 'Блич', 'Ван Пис', 'Атака Титанов'], correct: 'Наруто' },
  { image: '/titan.png', options: ['Наруто', 'Блич', 'Ван Пис', 'Атака Титанов'], correct: 'Атака Титанов' },
  { image: '/onepiece.png', options: ['Наруто', 'Блич', 'Ван Пис', 'Атака Титанов'], correct: 'Ван Пис' }
];

type Screen = 'start' | 'playing' | 'end' | 'stats' | 'settings' | 'leaderboard' | 'daily';

function App() {
  const [gameState, setGameState] = useState<Screen>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // Таймер

  const question = questions[currentQuestionIndex];

  // Логика таймера
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;

    if (timeLeft === 0) {
      setSelectedAnswer("Время вышло");
      setIsCorrect(false);
      return;
    }

    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, selectedAnswer, gameState]);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(15);
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    
    const correct = option === question.correct;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
    } else {
      setGameState('end');
    }
  };

  // --- ЭКРАН 1: ГЛАВНЫЙ ---
  if (gameState === 'start') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 50% 30%, #3a0000 0%, #0a0a0a 70%)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>👑</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Lv. 12</span>
              <div style={{ width: '80px', height: '6px', background: '#222', borderRadius: '3px', marginTop: '4px' }}>
                <div style={{ width: '60%', height: '100%', background: '#ff3b30', borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1c1c1e', padding: '8px 15px', borderRadius: '20px', border: '1px solid #333' }}>
            <span style={{ fontSize: '16px' }}>🪙</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>4 320</span>
            <div style={{ background: '#ff3b30', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', cursor: 'pointer', marginLeft: '5px' }}>+</div>
          </div>
        </div>

        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', zIndex: 10 }}>
          <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '0.85', letterSpacing: '-2px', margin: 0, textShadow: '0 5px 20px rgba(0,0,0,0.8)' }}>
            ANIME<br/><span style={{ color: '#ff3b30', fontStyle: 'italic' }}>QUIZ</span>
          </h1>
          <p style={{ color: '#888', marginTop: '15px', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>Угадай аниме<br/>по кадру</p>
        </div>

        <div style={{ zIndex: 10, marginBottom: '20px' }}>
          <button onClick={startGame} style={{ width: '100%', padding: '20px', fontSize: '20px', fontWeight: 'bold', color: 'white', background: '#ff3b30', borderRadius: '16px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(255, 59, 48, 0.4)', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>▶</span> Играть
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', zIndex: 10, marginBottom: '20px' }}>
          <button onClick={() => setGameState('daily')} style={{ background: '#151515', border: '1px solid #333', borderRadius: '12px', padding: '15px 10px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            <div style={{ textAlign: 'left' }}><div style={{ fontSize: '12px', fontWeight: 'bold' }}>Ежедневное</div><div style={{ fontSize: '10px', color: '#888' }}>задание</div></div>
          </button>
          <button onClick={() => setGameState('leaderboard')} style={{ background: '#151515', border: '1px solid #333', borderRadius: '12px', padding: '15px 10px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <div style={{ textAlign: 'left' }}><div style={{ fontSize: '12px', fontWeight: 'bold' }}>Таблица</div><div style={{ fontSize: '10px', color: '#888' }}>лидеров</div></div>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px 0', borderTop: '1px solid #222', zIndex: 10 }}>
          <div onClick={() => setGameState('start')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#ff3b30', cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>🏠</span><span style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>Главная</span></div>
          <div onClick={() => setGameState('stats')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#555', cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>📊</span><span style={{ fontSize: '10px', marginTop: '4px' }}>Статистика</span></div>
          <div onClick={() => setGameState('settings')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#555', cursor: 'pointer' }}><span style={{ fontSize: '22px' }}>⚙️</span><span style={{ fontSize: '10px', marginTop: '4px' }}>Настройки</span></div>
        </div>
      </div>
    );
  }

  // --- ЭКРАНЫ ЗАГЛУШКИ ---
  if (['stats', 'settings', 'leaderboard', 'daily'].includes(gameState)) {
    const titles: any = { stats: 'Статистика', settings: 'Настройки', leaderboard: 'Таблица лидеров', daily: 'Ежедневное задание' };
    const icons: any = { stats: '📊', settings: '⚙️', leaderboard: '🏆', daily: '📅' };
    
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => setGameState('start')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', marginRight: '15px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{icons[gameState]} {titles[gameState]}</h2>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#555' }}>
          <span style={{ fontSize: '60px', marginBottom: '20px', opacity: 0.5 }}>{icons[gameState]}</span>
          <p>Этот раздел скоро появится...</p>
        </div>
      </div>
    );
  }

  // --- ЭКРАН 3: КОНЕЦ ИГРЫ ---
  if (gameState === 'end') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 50% 10%, #3a0000 0%, #0a0a0a 60%)', padding: '20px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(255, 59, 48, 0.5))' }}>🏆</div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', lineHeight: '1.2' }}>Отличный<br/>результат!</h1>
        <p style={{ color: '#888', fontSize: '16px', marginBottom: '30px' }}>Ты угадал {score} из {questions.length}</p>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          <div style={{ background: '#1c1c1e', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #333' }}>
            <span>🪙</span> <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>+{score * 100}</span>
          </div>
        </div>
        <div style={{ width: '100%', background: '#151515', borderRadius: '16px', padding: '20px', border: '1px solid #222', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}><span style={{ color: '#ff3b30' }}>📊</span> Твоя статистика:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}><span style={{ color: '#888' }}>Результат</span><span style={{ fontWeight: 'bold' }}>{score} / {questions.length}</span></div>
        </div>
        <button onClick={startGame} style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', color: 'white', background: '#ff3b30', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 59, 48, 0.4)', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '20px' }}>🔄</span> Играть снова</button>
        <button onClick={() => setGameState('start')} style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', color: 'white', background: '#151515', borderRadius: '12px', border: '1px solid #333', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '20px' }}>🏠</span> На главную</button>
      </div>
    );
  }

  // --- ЭКРАН 2: ИГРА ---
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', padding: '20px', position: 'relative' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={() => setGameState('start')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>←</button>
        <div style={{ flexGrow: 1, margin: '0 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginBottom: '5px' }}>
            <span>Вопрос {currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#222', borderRadius: '3px' }}>
            <div style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, height: '100%', background: '#ff3b30', borderRadius: '3px' }}></div>
          </div>
        </div>
        {/* Таймер вернулся! */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: timeLeft <= 5 ? '#ff3b30' : '#34c759', fontWeight: 'bold', fontSize: '14px' }}>
          ⏱ 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>
      </div>

      <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: '2px solid #333', position: 'relative' }}>
        <img src={question.image} alt="Кадр" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '25px', lineHeight: '1.3' }}>Из какого аниме<br/>этот персонаж?</h2>

      <div style={{ display: 'grid', gap: '12px', flexGrow: 1 }}>
        {question.options.map((opt) => (
          <button 
            key={opt} 
            onClick={() => handleAnswer(opt)}
            style={{ 
              padding: '18px 20px', fontSize: '16px', fontWeight: '600', color: 'white', 
              background: '#151515', border: '1px solid #333', borderRadius: '12px', 
              cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
        <button style={{ background: '#151515', border: '1px solid #ff3b30', borderRadius: '12px', padding: '15px', color: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>💡</span> Подсказка (50 🪙)</button>
        <button style={{ background: '#151515', border: '1px solid #333', borderRadius: '12px', padding: '15px', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>⏭</span> Пропустить (100 🪙)</button>
      </div>

      {selectedAnswer !== null && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `4px solid ${isCorrect ? '#34c759' : '#ff3b30'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', boxShadow: `0 0 30px ${isCorrect ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)'}` }}>
            <span style={{ fontSize: '60px', color: isCorrect ? '#34c759' : '#ff3b30' }}>{isCorrect ? '✓' : '✕'}</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: isCorrect ? '#34c759' : '#ff3b30' }}>
            {isCorrect ? 'Верно!' : 'Неверно!'}
          </h1>
          <p style={{ color: '#888', fontSize: '16px', marginBottom: '30px' }}>
            {isCorrect ? `Это — ${question.correct}` : `Правильный ответ: ${question.correct}`}
          </p>

          {isCorrect && (
            <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
              <div style={{ background: '#1c1c1e', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #333' }}>
                <span>🪙</span> <span style={{ color: '#34c759', fontWeight: 'bold' }}>+100</span>
              </div>
            </div>
          )}

          <button onClick={handleNextQuestion} style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', color: 'white', background: isCorrect ? '#ff3b30' : '#333', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: isCorrect ? '0 4px 15px rgba(255, 59, 48, 0.4)' : 'none' }}>
            {currentQuestionIndex < questions.length - 1 ? 'Далее →' : 'Показать результат'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;