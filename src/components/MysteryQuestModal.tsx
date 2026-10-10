import React, { useState } from 'react';
import { Eye, Lock, Compass, ArrowRight, X, Sparkles, Footprints, ShieldCheck } from 'lucide-react';
import { Quest } from '../types/quest';
import { playGentleClick, playStartChime } from '../services/sound';

interface MysteryQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchMystery: (durationMinutes: 20 | 30) => Promise<Quest>;
  onBeginOutdoorMode: (quest: Quest) => void;
}

export const MysteryQuestModal: React.FC<MysteryQuestModalProps> = ({
  isOpen,
  onClose,
  onLaunchMystery,
  onBeginOutdoorMode,
}) => {
  const [duration, setDuration] = useState<20 | 30>(30);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [revealedQuest, setRevealedQuest] = useState<Quest | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleUnseal = async () => {
    playGentleClick();
    setIsGenerating(true);
    try {
      const q = await onLaunchMystery(duration);
      setIsGenerating(false);
      setIsRevealing(true);
      playStartChime();
      setTimeout(() => {
        setRevealedQuest(q);
      }, 900);
    } catch {
      setIsGenerating(false);
    }
  };

  const handleProceedOutside = () => {
    if (revealedQuest) {
      onBeginOutdoorMode(revealedQuest);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-xl perspective-1000">
        {!isRevealing && !revealedQuest ? (
          /* STATE 1: THE SEALED DOSSIER */
          <div className="bg-[#172714] text-[#f7f5ed] border-2 border-[#365928] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden forest-canopy-bg field-card-deckle tech-card transform transition-all duration-500">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#92ad88] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Accent */}
            <div className="absolute top-0 right-1/3 w-64 h-64 bg-[#8bc34a]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Wax Seal Badge */}
            <div className="w-16 h-16 rounded-full bg-[#20361b] border-2 border-[#8bc34a] mx-auto flex items-center justify-center shadow-lg relative mb-6">
              <Lock className="w-7 h-7 text-[#8bc34a]" />
              <div className="absolute -inset-1 rounded-full border border-[#8bc34a]/30 animate-pulse" />
            </div>

            {/* Strict Prominent Mystery Header */}
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#a0db6f]">
                CONFIDENTIAL FIELD MISSION
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-[#f7f5ed]">
                MYSTERY QUEST
              </h2>
            </div>

            {/* Minimalist Specification Badge */}
            <div className="mt-8 py-5 px-6 rounded-2xl bg-[#0e1a0c]/80 border border-[#2b4b20] text-center space-y-3">
              <div className="grid grid-cols-3 divide-x divide-[#2b4b20] text-center">
                <div className="px-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8da684] block">DURATION</span>
                  <span className="font-serif font-extrabold text-base sm:text-lg text-[#f4faee] mt-0.5 block">
                    {duration === 20 ? '20 MIN' : '20–30 MIN'}
                  </span>
                </div>
                <div className="px-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8da684] block">TERRAIN</span>
                  <span className="font-serif font-extrabold text-base sm:text-lg text-[#f4faee] mt-0.5 block">
                    PARK / CAMPUS
                  </span>
                </div>
                <div className="px-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8da684] block">LOCATION</span>
                  <span className="font-serif font-extrabold text-base sm:text-lg text-[#f4faee] mt-0.5 block">
                    OUTDOORS
                  </span>
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDuration(20)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  duration === 20
                    ? 'bg-[#8bc34a] text-[#0b1409] shadow-sm'
                    : 'bg-[#23381e] text-[#b3ccaa] hover:bg-[#2c4726]'
                }`}
              >
                20 MINUTES
              </button>
              <button
                type="button"
                onClick={() => setDuration(30)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  duration === 30
                    ? 'bg-[#8bc34a] text-[#0b1409] shadow-sm'
                    : 'bg-[#23381e] text-[#b3ccaa] hover:bg-[#2c4726]'
                }`}
              >
                30 MINUTES
              </button>
            </div>

            {/* Unseal Disclaimer */}
            <p className="mt-6 text-xs text-center text-[#9bb393] italic max-w-sm mx-auto leading-relaxed">
              "The mission remains undisclosed until you step outside. Designed to shatter everyday perceptual autopilot."
            </p>

            {/* Launch CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={handleUnseal}
                disabled={isGenerating}
                className="w-full py-4 px-8 rounded-2xl bg-[#8bc34a] hover:bg-[#7cb73f] text-[#0b1409] font-serif font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 btn-magnetic"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>SYNTHESIZING MYSTERY EXPEDITION...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>UNSEAL & REVEAL MISSION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* STATE 2: CINEMATIC REVEAL ANIMATION & UNVEILED MISSION */
          <div className="bg-[#faf7ef] dark:bg-[#111e10] border-2 border-[#d5ccb7] dark:border-[#27461e] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden field-card-deckle animate-scaleUp">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b-2 border-[#e3dacf] dark:border-[#1f3619] pb-4 mb-6">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f4faee] dark:text-[#0b1409] px-3.5 py-1 rounded-md">
                MYSTERY UNSEALED
              </span>
              <span className="text-xs font-mono text-[#61745a] dark:text-[#8ea287]">
                {revealedQuest?.durationMinutes} MIN · {revealedQuest?.environment.toUpperCase()}
              </span>
            </div>

            {/* Cinematic Mission Quote */}
            <div className="space-y-4 my-6 text-center">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#44662d] dark:text-[#8bc34a] block font-bold">
                YOUR MANDATE FOR THE NEXT {revealedQuest?.durationMinutes} MINUTES
              </span>
              <div className="py-6 px-6 sm:px-8 bg-[#f2ede0] dark:bg-[#172a15] rounded-3xl border-l-6 border-[#345c2c] dark:border-[#8bc34a] text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#142312] dark:text-[#f4f7ee] leading-tight">
                  "{revealedQuest?.mission}"
                </h3>
              </div>
            </div>

            {/* Observation Steps */}
            {revealedQuest?.steps && (
              <div className="my-6 space-y-2.5 text-left bg-[#f8f5ec] dark:bg-[#142413] p-5 rounded-2xl border border-[#dad1be] dark:border-[#243d1f]">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#44662d] dark:text-[#8bc34a] block mb-2">
                  DISCOVERY PROTOCOL:
                </span>
                {revealedQuest.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#2a3c25] dark:text-[#cde0cb]">
                    <span className="w-5 h-5 rounded-full bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] flex-shrink-0 flex items-center justify-center font-mono text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{st}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Core Reminder */}
            <div className="p-3.5 rounded-xl bg-[#eaf3e1] dark:bg-[#162e14] border border-[#bcdcb0] dark:border-[#295024] text-xs text-[#223d18] dark:text-[#bfdec0] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#44662d] dark:text-[#8bc34a] flex-shrink-0" />
              <span>
                <strong>Field Rule:</strong> Look closely. Do not touch or disturb anything. Lock your phone now.
              </span>
            </div>

            {/* Launch Outdoors */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold text-[#54684e] dark:text-[#8ea287] hover:bg-[#ede5d3] dark:hover:bg-[#1a3118] transition-colors"
              >
                Close For Now
              </button>
              <button
                onClick={handleProceedOutside}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 group btn-magnetic"
              >
                <Footprints className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409]" />
                <span>START TIMER & STEP OUTSIDE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
