import React, { useState } from 'react';
import { PlayerProfile, Gender } from '../types/game';
import { MISSIONS } from '../game/missions';
import { Shield, Sword, Volume2, VolumeX, Sparkles, Smartphone, Award, Play } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface TitleScreenProps {
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onStartGame: (missionId: number) => void;
  onOpenInstallModal: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  profile,
  onUpdateProfile,
  onStartGame,
  onOpenInstallModal,
}) => {
  const [selectedGender, setSelectedGender] = useState<Gender>(profile.gender);
  const [nameInput, setNameInput] = useState<string>(profile.name || 'آرش');
  const [selectedMissionId, setSelectedMissionId] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());

  const handleGenderChange = (g: Gender) => {
    setSelectedGender(g);
    const defaultTitle = g === 'female' ? 'گردآفرید پارسه' : 'دلاور پاسارگاد';
    onUpdateProfile({
      ...profile,
      gender: g,
      title: defaultTitle,
      name: nameInput,
    });
  };

  const handleStart = () => {
    const finalName = nameInput.trim() || (selectedGender === 'female' ? 'بانو آرتادخت' : 'آرش');
    const finalTitle = selectedGender === 'female' ? 'گردآفرید پارسه' : 'دلاور پاسارگاد';
    onUpdateProfile({
      ...profile,
      name: finalName,
      gender: selectedGender,
      title: finalTitle,
    });
    soundEngine.playSlash();
    onStartGame(selectedMissionId);
  };

  const toggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto z-20">
      {/* Background Hero Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-slate-950/90 to-black pointer-events-none" />

      {/* Top Header & Creator Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-400 tracking-wider">شاهکار اکشن حماسی</div>
            <div className="text-sm font-bold text-slate-200">سازنده: الیاس بادیاب</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>نصب نسخه موبایل (APK)</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Center Hero Lockup & Customization */}
      <div className="relative z-10 max-w-2xl mx-auto w-full my-auto text-center py-6">
        {/* Emblem & Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-4">
          <Sparkles className="w-4 h-4" />
          <span>پاسداری از تخت جمشید، آرامگاه کوروش بزرگ و فردوسی</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-md">
          پاسداران ایران: <span className="text-amber-400">نبرد جاودان</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto mb-6">
          با شمشیر هلالی و سپر زرین شیر و خورشید، در خیابان‌ها و محوطه‌های تاریخی ایران در برابر هجوم مهاجمان ایستادگی کنید.
        </p>

        {/* Character Creation Panel */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm text-right mb-6 shadow-2xl">
          <div className="text-xs font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Sword className="w-4 h-4" />
            <span>مشخصات قهرمان مدافع ایران</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">نام قهرمان شما:</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                maxLength={24}
                placeholder="مثال: کوروش، آرش، آتوسا..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">نقش دلاور:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    selectedGender === 'male'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>⚔️ دلاور مرد (پهلوان)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    selectedGender === 'female'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>🛡️ بانوی مبارز (گردآفرید)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mission Select */}
          <div className="mt-4">
            <label className="block text-xs text-slate-300 mb-2 font-medium">میدان نبرد را انتخاب کنید:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {MISSIONS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMissionId(m.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedMissionId === m.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{m.title.split(':')[0]}</div>
                  <div className="text-[10px] text-slate-400 truncate">{m.locationName}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>ورود به میدان نبرد و دفاع از ایران</span>
        </button>

        {/* Controls Hint */}
        <div className="mt-4 text-slate-400 text-[11px] flex flex-wrap items-center justify-center gap-3">
          <span>حرکت: <strong className="text-slate-200">WASD / جهت‌ها</strong></span>
          <span>•</span>
          <span>ضربه شمشیر: <strong className="text-slate-200">Space / J</strong></span>
          <span>•</span>
          <span>چرخشی سنگین: <strong className="text-slate-200">K</strong></span>
          <span>•</span>
          <span>سپر شیر و خورشید: <strong className="text-slate-200">E</strong></span>
          <span>•</span>
          <span>جهش / جاخالی: <strong className="text-slate-200">L / Shift</strong></span>
          <span>•</span>
          <span>قدرت ویژه کوروش: <strong className="text-amber-300">Q</strong></span>
          <span className="hidden md:inline">• در گوشی لمسی: جوی‌استیک و دکمه‌های صفحه</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>پاسداشت هویت و میراث تمدن کهن ایران</span>
        </div>
        <div>طراحی و ساخت اختصاصی: <strong>الیاس بادیاب</strong></div>
      </div>
    </div>
  );
};
