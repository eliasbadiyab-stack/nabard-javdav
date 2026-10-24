import React, { useRef, useState, useEffect } from 'react';
import { GameEngine } from '../game/GameEngine';
import { Sword, Shield, RotateCw, Wind, Flame } from 'lucide-react';

interface MobileControlsProps {
  engine: GameEngine | null;
  rage: number;
  maxRage: number;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ engine, rage, maxRage }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const joystickTouchIdRef = useRef<number | null>(null);

  // Joystick touch handlers
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    if (joystickTouchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    joystickTouchIdRef.current = touch.identifier;
    setIsJoystickActive(true);
    updateJoystickPos(touch.clientX, touch.clientY);
  };

  const updateJoystickPos = (clientX: number, clientY: number) => {
    if (!joystickRef.current || !engine) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = rect.width / 2 - 10;

    let moveX = 0;
    let moveY = 0;

    if (dist > 0) {
      const clampedDist = Math.min(dist, maxRadius);
      const angle = Math.atan2(dy, dx);
      const kx = Math.cos(angle) * clampedDist;
      const ky = Math.sin(angle) * clampedDist;
      setKnobPos({ x: kx, y: ky });

      moveX = kx / maxRadius;
      moveY = ky / maxRadius;
    } else {
      setKnobPos({ x: 0, y: 0 });
    }

    engine.input.touchMoveX = moveX;
    engine.input.touchMoveY = moveY;
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (joystickTouchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joystickTouchIdRef.current) {
          updateJoystickPos(t.clientX, t.clientY);
          break;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (joystickTouchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joystickTouchIdRef.current) {
          joystickTouchIdRef.current = null;
          setIsJoystickActive(false);
          setKnobPos({ x: 0, y: 0 });
          if (engine) {
            engine.input.touchMoveX = 0;
            engine.input.touchMoveY = 0;
          }
          break;
        }
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [engine]);

  // Screen camera swipe rotation
  const cameraSwipeTouchId = useRef<number | null>(null);
  const prevCameraX = useRef<number>(0);

  const handleCameraTouchStart = (e: React.TouchEvent) => {
    // Only capture if touch is in upper 60% of screen
    const touch = e.changedTouches[0];
    if (cameraSwipeTouchId.current === null) {
      cameraSwipeTouchId.current = touch.identifier;
      prevCameraX.current = touch.clientX;
    }
  };

  const handleCameraTouchMove = (e: React.TouchEvent) => {
    if (cameraSwipeTouchId.current === null || !engine) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === cameraSwipeTouchId.current) {
        const deltaX = touch.clientX - prevCameraX.current;
        engine.rotateCameraBy(-deltaX * 0.007);
        prevCameraX.current = touch.clientX;
        break;
      }
    }
  };

  const handleCameraTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === cameraSwipeTouchId.current) {
        cameraSwipeTouchId.current = null;
        break;
      }
    }
  };

  const isUltimateReady = rage >= maxRage;

  return (
    <div className="absolute inset-0 pointer-events-none z-15 select-none touch-none">
      {/* Upper Camera Drag Area */}
      <div
        className="absolute top-16 left-0 right-0 h-[45%] pointer-events-auto"
        onTouchStart={handleCameraTouchStart}
        onTouchMove={handleCameraTouchMove}
        onTouchEnd={handleCameraTouchEnd}
        onTouchCancel={handleCameraTouchEnd}
      />

      {/* Bottom Controls Layer */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
        {/* Left: Virtual Joystick */}
        <div
          ref={joystickRef}
          onTouchStart={handleJoystickTouchStart}
          className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-900/60 border-2 border-slate-700/60 flex items-center justify-center pointer-events-auto shadow-2xl active:border-amber-500/60 backdrop-blur-xs"
        >
          {/* Inner stick / knob */}
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300/80 shadow-lg flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            <div className="w-3 h-3 rounded-full bg-amber-200" />
          </div>
        </div>

        {/* Right: Combat Buttons Cluster */}
        <div className="flex items-end gap-3 pointer-events-auto">
          {/* Column with secondary buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Ultimate Special Button */}
            <button
              onClick={() => engine?.triggerUltimate()}
              disabled={!isUltimateReady}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center shadow-xl transition-all cursor-pointer ${
                isUltimateReady
                  ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 border-yellow-200 text-slate-950 scale-110 animate-bounce shadow-amber-500/50'
                  : 'bg-slate-900/70 border-slate-800 text-slate-600'
              }`}
              title="قدرت کوروش"
            >
              <Flame className="w-6 h-6 fill-current" />
            </button>

            {/* Dash / Dodge Button */}
            <button
              onClick={() => engine?.triggerDash()}
              className="w-12 h-12 md:w-13 md:h-13 rounded-full bg-slate-800/80 active:bg-amber-600 border border-slate-700 text-slate-200 active:text-white flex items-center justify-center shadow-lg cursor-pointer"
              title="جهش سریع"
            >
              <Wind className="w-5 h-5" />
            </button>
          </div>

          {/* Column with Shield and Heavy Attack */}
          <div className="flex flex-col gap-2.5">
            {/* Shield / Block */}
            <button
              onTouchStart={() => {
                if (engine) engine.input.block = true;
              }}
              onTouchEnd={() => {
                if (engine) engine.input.block = false;
              }}
              onMouseDown={() => {
                if (engine) engine.input.block = true;
              }}
              onMouseUp={() => {
                if (engine) engine.input.block = false;
              }}
              className="w-13 h-13 md:w-15 md:h-15 rounded-full bg-blue-900/80 active:bg-blue-600 border-2 border-blue-400/80 text-blue-200 active:text-white flex items-center justify-center shadow-xl cursor-pointer"
              title="سپر شیر و خورشید"
            >
              <Shield className="w-6 h-6 fill-blue-500/30" />
            </button>

            {/* Heavy Spin Attack */}
            <button
              onClick={() => engine?.triggerHeavyAttack()}
              className="w-13 h-13 md:w-15 md:h-15 rounded-full bg-amber-700/80 active:bg-amber-500 border border-amber-400/80 text-amber-100 flex items-center justify-center shadow-xl cursor-pointer"
              title="ضربه چرخشی سنگین"
            >
              <RotateCw className="w-6 h-6" />
            </button>
          </div>

          {/* Primary Attack Button (Large Sword) */}
          <button
            onClick={() => engine?.triggerAttack()}
            className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 active:from-amber-400 active:to-yellow-500 border-3 border-amber-300 text-slate-950 flex items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer"
            title="ضربه شمشیر"
          >
            <Sword className="w-9 h-9 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
