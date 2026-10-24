import React from 'react';
import { RotateCcw, Home, Skull } from 'lucide-react';

interface GameOverModalProps {
  reason: string;
  score: number;
  kills: number;
  onRetry: () => void;
  onBackToTitle: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  score,
  kills,
  onRetry,
  onBackToTitle,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs select-none">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/50 rounded-2xl p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Skull Icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
          <Skull className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-red-400 mb-1">شکست در نبرد</h2>
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">{reason}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] text-slate-400">نابودشدگان</div>
            <div className="text-lg font-black text-white font-mono">{kills}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] text-slate-400">امتیاز نهایی</div>
            <div className="text-lg font-black text-amber-400 font-mono">{score}</div>
          </div>
        </div>

        {/* Historic Courage Quote */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-6 text-xs text-amber-300/80 italic font-serif">
          «دلاور هرگز تسلیم نمی‌شود؛ برخیز و بار دیگر برای پاسداری از این خاک نبرد را آغاز کن!»
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRetry}
            className="py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-red-500/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>نبرد دوباره</span>
          </button>
          <button
            onClick={onBackToTitle}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>منوی اصلی</span>
          </button>
        </div>
      </div>
    </div>
  );
};
