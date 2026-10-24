import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { InstallModal } from './components/InstallModal';
import { GameState, PlayerProfile, MissionConfig } from './types/game';
import { MISSIONS } from './game/missions';
import { soundEngine } from './audio/soundEngine';

const STORAGE_KEY = 'iran_guardians_profile_v1';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      name: 'آرش دلاور',
      gender: 'male',
      title: 'دلاور پاسارگاد',
      kills: 0,
      highScore: 0,
      unlockedLevel: 1,
    };
  });

  // Game Engine dynamic stats
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [maxPlayerHp, setMaxPlayerHp] = useState<number>(100);
  const [monumentHp, setMonumentHp] = useState<number>(1000);
  const [maxMonumentHp, setMaxMonumentHp] = useState<number>(1000);
  const [rage, setRage] = useState<number>(0);
  const [maxRage] = useState<number>(100);
  const [kills, setKills] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [victoryStars, setVictoryStars] = useState<number>(3);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Canvas container & engine reference
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const currentMission: MissionConfig =
    MISSIONS.find(m => m.id === currentMissionId) || MISSIONS[0];

  // Save profile helper
  const updateProfile = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  // Start / Init Battle
  const handleStartGame = useCallback(
    (missionId: number) => {
      setCurrentMissionId(missionId);
      setGameState('playing');
      setKills(0);
      setScore(0);
      setCombo(0);
      setRage(0);

      // Clean up previous engine if any
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }

      // Defer engine mount to allow container element to size
      setTimeout(() => {
        if (!canvasMountRef.current) return;

        const targetMission = MISSIONS.find(m => m.id === missionId) || MISSIONS[0];

        const engine = new GameEngine(
          canvasMountRef.current,
          targetMission,
          profile.gender,
          profile.name,
          {
            onPlayerHealthChange: (hp, max) => {
              setPlayerHp(hp);
              setMaxPlayerHp(max);
            },
            onMonumentHealthChange: (hp, max) => {
              setMonumentHp(hp);
              setMaxMonumentHp(max);
            },
            onRageChange: (r) => {
              setRage(r);
            },
            onStatsUpdate: (newKills, newScore, newCombo) => {
              setKills(newKills);
              setScore(newScore);
              setCombo(newCombo);
            },
            onVictory: (stars) => {
              setVictoryStars(stars);
              setGameState('victory');
              // Update persistent stats
              const updatedScore = Math.max(profile.highScore, score);
              const updatedKills = profile.kills + kills;
              const nextUnlocked = Math.max(profile.unlockedLevel, missionId + 1);
              updateProfile({
                ...profile,
                highScore: updatedScore,
                kills: updatedKills,
                unlockedLevel: nextUnlocked,
              });
            },
            onGameOver: (reason) => {
              setGameOverReason(reason);
              setGameState('gameover');
            },
          }
        );

        engineRef.current = engine;
        setPlayerHp(engine.playerHp);
        setMaxPlayerHp(engine.maxPlayerHp);
        setMonumentHp(engine.monumentHp);
        setMaxMonumentHp(engine.maxMonumentHp);
      }, 50);
    },
    [profile, score, kills]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  const handlePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    }
  };

  const handleResume = () => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleNextMission = () => {
    const nextId = currentMissionId < MISSIONS.length ? currentMissionId + 1 : 1;
    handleStartGame(nextId);
  };

  const handleReplay = () => {
    handleStartGame(currentMissionId);
  };

  const handleBackToTitle = () => {
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }
    setGameState('title');
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* 3D WebGL Canvas Isolated Mount Container */}
      <div
        ref={canvasMountRef}
        className={`absolute inset-0 w-full h-full ${
          gameState === 'title' ? 'hidden' : 'block'
        }`}
      />

      {/* Title Screen View */}
      {gameState === 'title' && (
        <TitleScreen
          profile={profile}
          onUpdateProfile={updateProfile}
          onStartGame={handleStartGame}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />
      )}

      {/* In-Game Active HUD */}
      {gameState === 'playing' && (
        <>
          <HUD
            profile={profile}
            mission={currentMission}
            playerHp={playerHp}
            maxPlayerHp={maxPlayerHp}
            monumentHp={monumentHp}
            maxMonumentHp={maxMonumentHp}
            rage={rage}
            maxRage={maxRage}
            kills={kills}
            score={score}
            combo={combo}
            onPause={handlePause}
            onToggleMute={handleToggleMute}
            isMuted={isMuted}
          />
          <MobileControls
            engine={engineRef.current}
            rage={rage}
            maxRage={maxRage}
          />
        </>
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleReplay}
          onBackToTitle={handleBackToTitle}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          mission={currentMission}
          stars={victoryStars}
          score={score}
          kills={kills}
          onNextMission={handleNextMission}
          onReplay={handleReplay}
          onBackToTitle={handleBackToTitle}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          reason={gameOverReason}
          score={score}
          kills={kills}
          onRetry={handleReplay}
          onBackToTitle={handleBackToTitle}
        />
      )}

      {/* Android APK / PWA Install Guide Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
