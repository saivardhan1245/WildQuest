import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle2, Volume2, VolumeX, ArrowLeft, FastForward, Lock } from 'lucide-react';
import { Quest } from '../types/quest';
import { playStartChime, playCompleteChime, playGentleClick } from '../services/sound';

interface OutdoorModeViewProps {
  quest: Quest;
  onFinishQuest: (durationMinutesSpent: number) => void;
  onCancelQuest: () => void;
}

export const OutdoorModeView: React.FC<OutdoorModeViewProps> = ({
  quest,
  onFinishQuest,
  onCancelQuest
}) => {
  const totalSeconds = quest.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Play start chime on mount
  useEffect(() => {
    if (audioEnabled) {
      playStartChime();
    }
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (audioEnabled) playCompleteChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining, audioEnabled]);

  const toggleRunning = () => {
    playGentleClick();
    setIsRunning(!isRunning);
  };

  const handleFinish = () => {
    if (audioEnabled) playCompleteChime();
    const timeSpent = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60));
    onFinishQuest(timeSpent);
  };

  const handleFastForwardDemo = () => {
    playGentleClick();
    setSecondsRemaining(5);
  };

  // Format MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a1409] text-[#e8f2e2] flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden forest-canopy-bg">
      {/* Top Bar: Minimal Controls */}
      <div className="flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-1.5 text-xs text-[#a4c297] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#a4c297] hover:text-white transition-colors"
            title={audioEnabled ? 'Audio chime active' : 'Audio muted'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-[#8bc34a]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Peaceful Atmosphere & Giant Countdown */}
      <div className="my-auto text-center max-w-lg mx-auto space-y-8">
        {/* Breathing Pulse Indicator Ring */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#8bc34a] animate-breathing" />
          <div className="w-16 h-16 rounded-full bg-[#1b2d18] border border-[#3b5d2e] flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6 text-[#8bc34a]" />
          </div>
        </div>

        {/* Huge Countdown Display */}
        <div>
          <div className="font-mono text-7xl sm:text-9xl font-bold tracking-tight text-[#f3faf0] drop-shadow-md">
            {formattedTime}
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#7d9b71] font-semibold mt-3">
            {secondsRemaining === 0 ? 'Mission Concluded · Return Home' : isRunning ? 'Time Remaining Outdoors' : 'Timer Paused'}
          </div>
        </div>

        {/* Peaceful Directives & Active Mission */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center max-w-sm mx-auto">
            <span className="text-[10px] font-mono text-[#8bc34a] uppercase tracking-wider block font-bold">
              ACTIVE FIELD MANDATE
            </span>
            <p className="text-xs font-serif font-bold text-[#e6f4e2] mt-0.5 leading-snug">
              "{quest.mission}"
            </p>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-[#c4dec0]">
            "AI gives you the question. The real world gives you the answer."
          </p>
          <p className="text-sm sm:text-base font-bold tracking-wide text-[#8bc34a] uppercase">
            Put your phone away.
          </p>
        </div>

        {/* Discrete fast forward for evaluation testing */}
        <div className="pt-2">
          <button
            onClick={handleFastForwardDemo}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5b7a50] hover:text-[#9bc28d] transition-colors"
          >
            <FastForward className="w-3 h-3" />
            <span>Fast-forward timer (5s remaining)</span>
          </button>
        </div>
      </div>

      {/* Minimal Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10">
        <button
          onClick={toggleRunning}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 text-xs font-bold text-[#d2e4cb] transition-colors flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Timer</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Resume Timer</span>
            </>
          )}
        </button>

        <button
          onClick={handleFinish}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#8bc34a] hover:bg-[#7cb33d] text-[#0a1409] text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I HAVE RETURNED · RECORD FIELD NOTES</span>
        </button>
      </div>

      {/* Exit Confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1b2d18] text-[#f7f5ed] rounded-3xl p-6 max-w-sm w-full border border-[#3b5d2e] shadow-2xl text-center space-y-4">
            <h3 className="font-serif font-bold text-lg">Leave Quest Early?</h3>
            <p className="text-xs text-[#a2be97]">
              You can exit without completing. No unearned minutes will be added.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-xs font-semibold"
              >
                Stay Outside
              </button>
              <button
                onClick={onCancelQuest}
                className="flex-1 py-2.5 rounded-xl bg-[#c2410c] text-white text-xs font-semibold"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
