import { useState, useEffect, useRef } from 'react';

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
  const [coins, setCoins] = useState(4320);
  const [timeLeft, setTimeLeft] = useState(15);

  const question = questions[currentQuestionIndex];

  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const wrongAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudio.current = new Audio('/correct.mp3');
    wrongAudio.current = new Audio('/wrong.mp3');
  }, []);

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
    
    if (correct) {
      setScore(score + 1);
      setCoins(coins + 100);
    }
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: 'radial-gradient(circle at 50% 30%, #4a0000 0%, #0a0a0a 80%)', padding: '20px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-10%', fontSize: '200px', opacity: 0.05, transform: 'rotate(15deg)', zIndex: 0 }}>⚔️</div>
        <div style={{ position: 'absolute', bottom: '20%', left: '-10%', fontSize: '200px', opacity: 0.05, transform: 'rotate(-15deg)', zIndex: 0 }}>🌸</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', zIndex: 10 }}>
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
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{coins.toLocaleString()}</span>
            <div style={{ background: '#ff3b30', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', cursor: 'pointer', marginLeft: '5px' }}>+</div>
          </div>
        </div>

        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', zIndex: 10 }}>
          <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '0.85', letterSpacing: '-2px', margin: 0, textShadow: '0 5px 30px rgba(255, 59, 48, 0.4)' }}>
            ANIME<br/><span style={{ color: '#ff3b30', fontStyle: 'italic' }}>QUIZ</span>
          </h1>
          <p style={{ color: '#aaa', marginTop: '15px', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>Угадай аниме<br/>по кадру</p>
        </div>

        <div style={{ zIndex: 10, marginBottom: '20px' }}>
          <button onClick={startGame} style={{ width: '100%', padding: '20px', fontSize: '20px', fontWeight: 'bold', color: 'white', background: 'linear-gradient(135deg, #ff3b30, #cc0000)', borderRadius: '16px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(255, 59, 48, 0.5)', cursor: 'pointer', transition: 'transform 0.1s' }}>
            <span style={{ fontSize: '18px' }}>▶</span> Играть
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

  // --- ЭКРАН: СТАТИСТИКА ---
  if (gameState === 'stats') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => setGameState('start')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', marginRight: '15px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>📊 Статистика</h2>
        </div>

        <div style={{ background: 'radial-gradient(circle at top right, #3a0000, #151515)', borderRadius: '16px', padding: '20px', border: '1px solid #333', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ff3b30', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>👤</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Fayyy</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Lv. 12 • 720 / 1500 EXP</div>
          </div>
        </div>

        <div style={{ background: '#151515', borderRadius: '16px', padding: '20px', border: '1px solid #222', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' }}>Активность за неделю</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px' }}>
            {[40, 70, 30, 90, 50, 100, 60].map((height, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                <div style={{ width: '25px', height: `${height}%`, background: i === 5 ? '#ff3b30' : '#333', borderRadius: '4px' }}></div>
                <div style={{ fontSize: '10px', color: '#555' }}>{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#151515', borderRadius: '16px', padding: '20px', border: '1px solid #222' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>Достижения</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0a0a0a', padding: '10px', borderRadius: '12px' }}>
              <span style={{ fontSize: '24px' }}>🔥</span>
              <div style={{ fontSize: '12px' }}>Побед: {score}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0a0a0a', padding: '10px', borderRadius: '12px' }}>
              <span style={{ fontSize: '24px' }}>⏱</span>
              <div style={{ fontSize: '12px' }}>Время: 12.5с</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ЭКРАН: ЕЖЕДНЕВНОЕ ЗАДАНИЕ ---
  if (gameState === 'daily') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => setGameState('start')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', marginRight: '15px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>📅 Ежедневный бонус</h2>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '5px' }}>Заходи каждый день</p>
          <p style={{ color: '#888', fontSize: '14px' }}>и получай награды!</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', overflowX: 'auto' }}>
          {[1, 2, 3, 4, 5].map((day) => (
            <div key={day} style={{ 
              minWidth: '65px', flex: 1, background: day === 1 ? 'radial-gradient(circle, #3a0000, #151515)' : '#151515', 
              border: day === 1 ? '1px solid #ff3b30' : '1px solid #333', 
              borderRadius: '12px', padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' 
            }}>
              <span style={{ fontSize: '10px', color: '#888' }}>День {day}</span>
              <span style={{ fontSize: '24px' }}>{day === 1 ? '🪙' : day === 2 ? '💎' : day === 3 ? '🪙' : day === 4 ? '💎' : '🪙'}</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: day === 1 ? '#ff3b30' : 'white' }}>
                {day === 1 ? '+100' : day === 2 ? '+1' : day === 3 ? '+200' : day === 4 ? '+2' : '+300'}
              </span>
            </div>
          ))}
        </div>

        <button style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', color: 'white', background: 'linear-gradient(135deg, #ff3b30, #cc0000)', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 59, 48, 0.4)' }}>
          Забрать награду
        </button>
      </div>
    );
  }

  // --- ЭКРАН: НАСТРОЙКИ ---
  if (gameState === 'settings') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => setGameState('start')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', marginRight: '15px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>⚙️ Настройки</h2>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#555' }}>
          <span style={{ fontSize: '60px', marginBottom: '20px', opacity: 0.5 }}>⚙️</span>
          <p>Этот раздел скоро появится...</p>
        </div>
      </div>
    );
  }

  // --- ЭКРАН: ТАБЛИЦА ЛИДЕРОВ ---
  if (gameState === 'leaderboard') {
    const leaders = [
      { name: 'AnimeMaster', score: 12450, avatar: 'https://i.pravatar.cc/150?img=11' },
      { name: 'donkek', score: 11980, avatar: 'https://i.pravatar.cc/150?img=12' },
      { name: 'senpai_228', score: 11760, avatar: 'https://i.pravatar.cc/150?img=13' },
      { name: 'naruto_fan', score: 11420, avatar: 'https://i.pravatar.cc/150?img=14' },
      { name: 'Sasuke_Kun', score: 10950, avatar: 'https://i.pravatar.cc/150?img=15' },
    ];

    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => setGameState('start')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', marginRight: '15px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>🏆 Таблица лидеров</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px 15px', background: '#ff3b30', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Все игроки</div>
          <div style={{ padding: '8px 15px', background: '#151515', color: '#888', borderRadius: '20px', fontSize: '12px', border: '1px solid #333' }}>Друзья</div>
          <div style={{ padding: '8px 15px', background: '#151515', color: '#888', borderRadius: '20px', fontSize: '12px', border: '1px solid #333' }}>Неделя</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {leaders.map((leader, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', background: '#151515', padding: '12px 15px', borderRadius: '12px', border: '1px solid #222' }}>
              <div style={{ width: '30px', fontSize: '14px', fontWeight: 'bold', color: index === 0 ? '#ffcc00' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#555' }}>
                {index + 1}
              </div>
              <img src={leader.avatar} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '15px' }} />
              <div style={{ flexGrow: 1, fontSize: '14px', fontWeight: 'bold' }}>{leader.name}</div>
              <div style={{ fontSize: '14px', color: '#888', fontWeight: 'bold' }}>{leader.score.toLocaleString()}</div>
            </div>
          ))}
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