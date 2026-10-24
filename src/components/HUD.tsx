import React from 'react';
import { MissionConfig, PlayerProfile } from '../types/game';
import { Shield, Flame, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface HUDProps {
  profile: PlayerProfile;
  mission: MissionConfig;
  playerHp: number;
  maxPlayerHp: number;
  monumentHp: number;
  maxMonumentHp: number;
  rage: number;
  maxRage: number;
  kills: number;
  score: number;
  combo: number;
  onPause: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  profile,
  mission,
  playerHp,
  maxPlayerHp,
  monumentHp,
  maxMonumentHp,
  rage,
  maxRage,
  kills,
  score,
  combo,
  onPause,
  onToggleMute,
  isMuted,
}) => {
  const playerHpPercent = Math.max(0, Math.min(100, (playerHp / maxPlayerHp) * 100));
  const monumentHpPercent = Math.max(0, Math.min(100, (monumentHp / maxMonumentHp) * 100));
  const ragePercent = Math.max(0, Math.min(100, (rage / maxRage) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 md:p-5 select-none overflow-hidden">
      {/* Top Bar Cluster */}
      <div className="flex items-start justify-between w-full gap-2">
        {/* Left: Player Hero Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 md:p-3 min-w-[170px] md:min-w-[240px] shadow-lg pointer-events-auto">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400">{profile.name}</span>
              <span className="text-[10px] text-slate-400">({profile.gender === 'female' ? 'گردآفرید' : 'پهلوان'})</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 tabular-nums">
              {playerHp}/{maxPlayerHp}
            </div>
          </div>

          {/* Player HP Bar */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-2">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                playerHpPercent > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : playerHpPercent > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
              }`}
              style={{ width: `${playerHpPercent}%` }}
            />
          </div>

          {/* Rage / Ultimate Bar */}
          <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold mb-1">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>خشم کوروش (Q)</span>
            </span>
            <span className="font-mono">{Math.floor(ragePercent)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                ragePercent >= 100
                  ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 shadow-md shadow-amber-400/50'
                  : 'bg-gradient-to-r from-amber-600 to-yellow-600'
              }`}
              style={{ width: `${ragePercent}%` }}
            />
          </div>
        </div>

        {/* Center: Monument Objective & Health */}
        <div className="bg-slate-900/90 border border-amber-600/40 rounded-xl p-2.5 md:p-3 min-w-[200px] md:min-w-[320px] text-center shadow-lg pointer-events-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="truncate">{mission.title.split(':')[1] || mission.title}</span>
          </div>

          <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between font-mono">
            <span>سلامت بنای تاریخی</span>
            <span className="text-amber-400 tabular-nums">{monumentHp}/{maxMonumentHp}</span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 transition-all duration-200"
              style={{ width: `${monumentHpPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Kills, Score, Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 md:p-2.5 text-center min-w-[90px] shadow-lg">
            <div className="text-[10px] text-slate-400">نابودشدگان</div>
            <div className="text-base font-black text-amber-400 font-mono tabular-nums">
              {kills} / <span className="text-slate-500 text-xs">{mission.targetKills}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 md:p-2.5 text-center min-w-[90px] hidden sm:block shadow-lg">
            <div className="text-[10px] text-slate-400">امتیاز شرف</div>
            <div className="text-base font-black text-emerald-400 font-mono tabular-nums">
              {score}
            </div>
          </div>

          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onPause}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="توقف موقت"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Dynamic Combo Badge (appears when combo > 1) */}
      {combo > 1 && (
        <div className="self-center my-auto pointer-events-none transform -translate-y-6 animate-bounce">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-4 py-1.5 rounded-full font-black text-sm md:text-base shadow-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>کمبو ضربه: {combo}×</span>
          </div>
        </div>
      )}

      {/* Creator watermark at bottom-center (unobtrusive, game style) */}
      <div className="self-center text-[10px] text-slate-500/70 font-semibold mb-1 pointer-events-none">
        سازنده: الیاس بادیاب • پاسداران ایران
      </div>
    </div>
  );
};
