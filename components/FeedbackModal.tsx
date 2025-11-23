import React from 'react';
import { ExampleWord, QuizItem } from '../types';
import { Button } from './Button';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  item: QuizItem;
  onNext: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, isCorrect, item, onNext }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl transform transition-all scale-100 animate-bounce-in border-4 border-white ring-4 ring-yellow-200">
        
        {/* Header Icon */}
        <div className="flex justify-center -mt-16 mb-4">
          <div className={`rounded-full p-4 border-4 border-white shadow-lg ${isCorrect ? 'bg-green-400' : 'bg-rose-400'}`}>
            <span className="text-4xl">{isCorrect ? '🌟' : '🤔'}</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-500' : 'text-rose-500'}`}>
            {isCorrect ? '答对啦！' : '再接再厉！'}
          </h2>
          <div className="flex items-center justify-center gap-4 text-slate-700 bg-slate-50 rounded-xl p-4 mx-auto w-fit">
            <span className="text-5xl font-black">{item.character}</span>
            <span className="text-3xl font-medium text-slate-500">{item.pinyin}</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider text-center">学习词语</h3>
          {item.examples.map((ex, idx) => (
            <div key={idx} className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
              <span className="text-lg font-bold text-amber-800">{ex.word}</span>
              <span className="text-md text-amber-600 font-mono">{ex.pinyin}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={onNext} variant="primary" size="lg" className="w-full">
            继续下一题 ➔
          </Button>
        </div>
      </div>
    </div>
  );
};