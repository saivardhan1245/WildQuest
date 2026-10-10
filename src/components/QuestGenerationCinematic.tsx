import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Trees, EyeOff, CheckCircle2 } from 'lucide-react';

interface QuestGenerationCinematicProps {
  durationMinutes: number;
  environmentName: string;
}

const CINEMATIC_PHRASES = [
  { text: 'Checking your time...', detail: 'Calibrating a comfortable outdoor walking perimeter', icon: Compass },
  { text: 'Thinking about your surroundings...', detail: 'Assessing canopy structures, textures, and living signs', icon: Trees },
  { text: 'Finding something worth noticing...', detail: 'Synthesizing subtle physical-world checkpoints with Gemma', icon: EyeOff },
  { text: 'Your mission is ready.', detail: 'Preparing your tactile field card...', icon: Sparkles }
];

export const QuestGenerationCinematic: React.FC<QuestGenerationCinematicProps> = ({
  durationMinutes,
  environmentName
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 750);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 1500);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const current = CINEMATIC_PHRASES[currentStepIndex];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d160c]/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#1b2d18] text-[#f6f3e9] border border-[#3b5d2e] rounded-3xl max-w-md w-full p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden forest-canopy-bg">
        {/* Soft atmospheric glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#8bc34a]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Center Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#294222] border border-[#4d7d3d] mx-auto flex items-center justify-center mb-6 shadow-md">
          <Icon className="w-8 h-8 text-[#8bc34a] animate-pulse" />
        </div>

        {/* Dynamic Editorial Text */}
        <h3 className="font-serif text-2xl font-extrabold tracking-tight text-[#f4faee] min-h-[4rem] flex items-center justify-center transition-all duration-300">
          "{current.text}"
        </h3>

        <p className="text-xs text-[#a2be97] mt-1 transition-all duration-300">
          {current.detail}
        </p>

        {/* Progress Bar Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {CINEMATIC_PHRASES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStepIndex
                  ? 'w-8 bg-[#8bc34a]'
                  : i < currentStepIndex
                  ? 'w-3 bg-[#4d7d3d]'
                  : 'w-3 bg-[#243a1e]'
              }`}
            />
          ))}
        </div>

        {/* Mission parameters reminder */}
        <div className="mt-8 pt-4 border-t border-[#294222] text-[11px] font-mono text-[#8fa883] flex items-center justify-between">
          <span>{durationMinutes} MIN ALLOCATION</span>
          <span>·</span>
          <span>{environmentName.toUpperCase()}</span>
          <span>·</span>
          <span>OPEN GEMMA</span>
        </div>
      </div>
    </div>
  );
};
