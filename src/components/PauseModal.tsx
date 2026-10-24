import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onBackToTitle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onBackToTitle,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-xl font-bold text-white mb-1">توقف موقت نبرد</h3>
        <p className="text-xs text-slate-400 mb-6">سازنده بازی: الیاس بادیاب</p>

        <div className="flex flex-col gap-2.5 mb-5">
          <button
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ادامه نبرد</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>شروع دوباره این مرحله</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'فعال‌سازی صدا' : 'قطع صدای نبرد'}</span>
          </button>

          <button
            onClick={onBackToTitle}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>منوی اصلی</span>
          </button>
        </div>
      </div>
    </div>
  );
};
