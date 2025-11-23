
import React, { useState } from 'react';
import { fetchQuizData } from './services/geminiService';
import { AppState, GameMode, QuizItem } from './types';
import { Button } from './components/Button';
import { QuizCard } from './components/QuizCard';
import { FeedbackModal } from './components/FeedbackModal';
import { playSound } from './services/audioService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.HANZI_TO_PINYIN);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("正在准备题目...");

  // Helper to shuffle array
  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startGame = async (mode: GameMode) => {
    playSound('start');
    setGameMode(mode);
    setAppState(AppState.LOADING);
    setLoadingMessage("AI老师正在出题中...");
    
    try {
      const data = await fetchQuizData();
      setQuizItems(data.items);
      setCurrentIndex(0);
      setScore(0);
      setAppState(AppState.QUIZ);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleAnswer = (selectedOption: string) => {
    const currentItem = quizItems[currentIndex];
    const correctAnswer = gameMode === GameMode.HANZI_TO_PINYIN 
      ? currentItem.pinyin 
      : currentItem.character;

    const isCorrect = selectedOption === correctAnswer;
    
    if (isCorrect) {
      playSound('correct');
      setScore(prev => prev + 1);
    } else {
      playSound('wrong');
    }
    
    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAppState(AppState.FINISHED);
      // Small delay to ensure the modal close sound (if any) doesn't clash, though we only have click.
      setTimeout(() => playSound('victory'), 300);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8">
            <div className="animate-bounce text-6xl mb-4">🐼</div>
            <h1 className="text-5xl md:text-6xl font-black text-sky-500 tracking-wider drop-shadow-sm">
              萌萌识字
            </h1>
            <p className="text-xl text-gray-500 max-w-md">
              和AI老师一起学习常见汉字！
              <br/>
              Choose your challenge mode below:
            </p>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => startGame(GameMode.HANZI_TO_PINYIN)}
                className="w-full flex items-center justify-center gap-2"
              >
                <span>看字选音</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">汉 ➔ pin</span>
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => startGame(GameMode.PINYIN_TO_HANZI)}
                className="w-full flex items-center justify-center gap-2"
              >
                <span>看音选字</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">pin ➔ 汉</span>
              </Button>
            </div>
          </div>
        );

      case AppState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
            <div className="w-16 h-16 border-8 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-sky-600">{loadingMessage}</h2>
            <p className="text-gray-400 mt-2">Gathering 10 fun words for you...</p>
          </div>
        );

      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
            <div className="text-6xl mb-6">😵‍💫</div>
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Oops! Something went wrong.</h2>
            <Button onClick={() => setAppState(AppState.WELCOME)}>Try Again</Button>
          </div>
        );

      case AppState.QUIZ:
        const currentItem = quizItems[currentIndex];
        const isHanziToPinyin = gameMode === GameMode.HANZI_TO_PINYIN;
        
        // Prepare options
        const correctAnswer = isHanziToPinyin ? currentItem.pinyin : currentItem.character;
        const wrongAnswers = isHanziToPinyin ? currentItem.wrongPinyins : currentItem.wrongChars;
        
        // Simple random shuffle every render is acceptable here for simplicity as discussed
        const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

        return (
          <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-2xl mx-auto">
            {/* Header Status */}
            <div className="w-full flex justify-between items-center mb-8">
              <Button size="sm" variant="outline" onClick={() => setAppState(AppState.WELCOME)}>
                🏠 Home
              </Button>
              <div className="flex flex-col items-end">
                 <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Question</div>
                 <div className="text-2xl font-black text-sky-500">{currentIndex + 1} / {quizItems.length}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-gray-200 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-sky-400 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentIndex) / quizItems.length) * 100}%` }}
              ></div>
            </div>

            {/* Card */}
            <div className="w-full">
              <QuizCard 
                content={isHanziToPinyin ? currentItem.character : currentItem.pinyin} 
                isPinyin={!isHanziToPinyin} 
              />
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {allOptions.map((opt, idx) => (
                <Button 
                  key={`${currentIndex}-${opt}-${idx}`} 
                  variant="outline" 
                  size="lg" 
                  className="h-24 text-2xl font-bold hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </Button>
              ))}
            </div>

            <FeedbackModal 
              isOpen={showFeedback}
              isCorrect={lastAnswerCorrect}
              item={currentItem}
              onNext={handleNextQuestion}
            />
          </div>
        );

      case AppState.FINISHED:
        const percentage = Math.round((score / quizItems.length) * 100);
        let emoji = '😐';
        let title = 'Completed!';
        let color = 'text-blue-500';

        if (percentage === 100) {
          emoji = '🏆';
          title = 'Perfect Score!';
          color = 'text-yellow-500';
        } else if (percentage >= 80) {
          emoji = '🎉';
          title = 'Great Job!';
          color = 'text-green-500';
        } else if (percentage >= 60) {
          emoji = '👍';
          title = 'Good Effort!';
          color = 'text-blue-400';
        }

        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-8 bg-white/50">
             <div className="text-8xl animate-bounce">{emoji}</div>
             <div>
               <h2 className={`text-4xl font-black mb-2 ${color}`}>{title}</h2>
               <p className="text-gray-500">You scored {score} out of {quizItems.length}</p>
             </div>

             <div className="text-6xl font-black text-slate-800">
               {score * 10}<span className="text-2xl text-gray-400 ml-1">pts</span>
             </div>

             <div className="flex gap-4 w-full max-w-xs">
               <Button variant="primary" className="flex-1" onClick={() => setAppState(AppState.WELCOME)}>
                 Main Menu
               </Button>
               <Button variant="success" className="flex-1" onClick={() => startGame(gameMode)}>
                 Replay
               </Button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 font-sans text-slate-800">
      {renderContent()}
    </div>
  );
};

export default App;
