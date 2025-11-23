import React from 'react';

interface QuizCardProps {
  content: string;
  isPinyin: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({ content, isPinyin }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-200 flex flex-col items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-100 rounded-full opacity-50"></div>
      
      <h2 className="text-gray-400 text-lg font-bold uppercase tracking-widest mb-2 z-10">
        {isPinyin ? "请选择对应的汉字" : "请选择对应的拼音"}
      </h2>
      <div className={`font-black z-10 text-slate-700 ${isPinyin ? 'text-6xl' : 'text-8xl'}`}>
        {content}
      </div>
    </div>
  );
};