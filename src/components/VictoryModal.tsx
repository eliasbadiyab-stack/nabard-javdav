import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MissionConfig } from '../types/game';
import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface VictoryModalProps {
  mission: MissionConfig;
  stars: number;
  score: number;
  kills: number;
  onNextMission: () => void;
  onReplay: () => void;
  onBackToTitle: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  mission,
  stars,
  score,
  kills,
  onNextMission,
  onReplay,
  onBackToTitle,
}) => {
  useEffect(() => {
    // Fire celebratory confetti with Iranian tricolor & gold particles
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#ffffff', '#ef4444', '#f59e0b'],
    });
  }, []);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="max-w-md w-full bg-slate-900 border border-amber-500/50 rounded-2xl p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Victory Trophy */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-amber-400 mb-1">پیروزی حماسی ایران!</h2>
        <div className="text-xs text-slate-300 mb-4">{mission.title} با موفقیت پاسداری شد</div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {[1, 2, 3].map(i => (
            <Star
              key={i}
              className={`w-7 h-7 ${
                i <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Historic Quote */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mb-5 text-right">
          <p className="text-xs text-amber-200/90 leading-relaxed italic mb-1.5 font-serif">
            {mission.historicalQuote}
          </p>
          <div className="text-[10px] text-slate-400 font-bold">— {mission.quoteAuthor}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] text-slate-400">نابودشدگان تاریکی</div>
            <div className="text-lg font-black text-white font-mono">{kills}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
            <div className="text-[10px] text-slate-400">امتیاز نبرد</div>
            <div className="text-lg font-black text-emerald-400 font-mono">{score}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onNextMission}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ورود به مرحله بعدی</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>نبرد دوباره</span>
            </button>
            <button
              onClick={onBackToTitle}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>منوی اصلی</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
