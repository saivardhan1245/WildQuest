import React from 'react';
import { Footprints, ArrowRight, EyeOff, RotateCcw } from 'lucide-react';
import { Quest } from '../types/quest';
import { CATEGORIES } from '../utils/categories';

interface QuestCardViewProps {
  quest: Quest;
  onStartOutdoorMode: () => void;
  onGenerateNew: () => void;
  onCancel: () => void;
}

export const QuestCardView: React.FC<QuestCardViewProps> = ({
  quest,
  onStartOutdoorMode,
  onGenerateNew,
  onCancel
}) => {
  const catMeta = CATEGORIES[quest.category] || CATEGORIES.biodiversity;
  const questSerialNumber = `QUEST #${quest.id.slice(-4).toUpperCase()}`;

  return (
    <div className="max-w-2xl mx-auto py-6 px-2 animate-reveal">
      {/* Premium Physical Field Guide Card */}
      <div className="relative bg-[#faf7ef] dark:bg-[#111e10] border-2 border-[#d5ccb7] dark:border-[#284521] rounded-3xl p-6 sm:p-10 shadow-xl field-card-deckle overflow-hidden tech-card">
        {/* Subtle decorative vintage watermark compass */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 border-8 border-[#3d6132]/5 dark:border-[#8bc34a]/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-52 h-52 border-2 border-dashed border-[#3d6132]/10 dark:border-[#8bc34a]/10 rounded-full pointer-events-none" />

        {/* Top Paper Header: Quest Serial + Physical Field Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#e3dacf] dark:border-[#1f3619] pb-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-widest bg-[#1b2d18] dark:bg-[#1a3317] text-[#f4faee] px-3 py-1 rounded-md">
              {questSerialNumber}
            </span>
            <span className="text-xs font-serif font-bold text-[#1e3914] dark:text-[#8bc34a] uppercase tracking-wider">
              Official Field Mission
            </span>
          </div>

          <div className="text-[11px] font-mono font-semibold text-[#344e2c] dark:text-[#8ea287]">
            MODEL: {quest.generatedByProvider.toUpperCase()}
          </div>
        </div>

        {/* Quest Title & Category */}
        <div className="mt-6">
          {/* Signature Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {quest.isMysteryQuest && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1b2d18] text-[#8bc34a] border border-[#2e5020] px-2.5 py-0.5 rounded-md">
                MYSTERY MISSION UNSEALED
              </span>
            )}
            {quest.branchedFromDiscoveryText && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#e2edd8] dark:bg-[#183116] text-[#1c3814] dark:text-[#9fe06f] border border-[#a2cf8d] dark:border-[#2f5526] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <span>🌿 BRANCHED FROM DISCOVERY</span>
              </span>
            )}
            {quest.curiositySeed && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#e2edd8] dark:bg-[#172e16] text-[#1c3814] dark:text-[#a0db6f] border border-[#a2cf8d] dark:border-[#2a5124] px-2.5 py-0.5 rounded-md">
                ✨ CURIOSITY CHAIN
              </span>
            )}
            <span className="text-xs uppercase font-bold tracking-widest text-[#543d22] dark:text-[#be9b6b]">
              {catMeta.name}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#142312] dark:text-[#f4f7ee] leading-[1.12]">
            {quest.title}
          </h2>

          {/* Transparent Adaptive Reason Banner (Never claims AI learned unless real data caused it) */}
          {quest.adaptationReason && (
            <div className="mt-3 px-3.5 py-2 rounded-xl bg-[#f0ebd9] dark:bg-[#162714] border border-[#d6cbaf] dark:border-[#27441f] text-[11px] text-[#243c1b] dark:text-[#a3bfa0] flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#1e3914] dark:bg-[#8bc34a] flex-shrink-0" />
              <span>{quest.adaptationReason}</span>
            </div>
          )}

          {/* Three Physical Badges: Difficulty, Time, Environment */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
            {/* Difficulty */}
            <div className="bg-[#f0ede1] dark:bg-[#162714] border border-[#dad1be] dark:border-[#243d1f] p-2.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#354f2c] dark:text-[#8ea287] block">Difficulty</span>
              <span className="font-serif font-bold text-xs sm:text-sm text-[#142312] dark:text-[#f4f7ee] mt-0.5 block">
                {quest.difficulty.toUpperCase()}
              </span>
            </div>

            {/* Time */}
            <div className="bg-[#f0ede1] dark:bg-[#162714] border border-[#dad1be] dark:border-[#243d1f] p-2.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#354f2c] dark:text-[#8ea287] block">Time</span>
              <span className="font-serif font-bold text-xs sm:text-sm text-[#142312] dark:text-[#f4f7ee] mt-0.5 block">
                {quest.durationMinutes} MIN
              </span>
            </div>

            {/* Environment */}
            <div className="bg-[#f0ede1] dark:bg-[#162714] border border-[#dad1be] dark:border-[#243d1f] p-2.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#354f2c] dark:text-[#8ea287] block">Environment</span>
              <span className="font-serif font-bold text-xs sm:text-sm text-[#142312] dark:text-[#f4f7ee] mt-0.5 block">
                {quest.environment.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* MISSION Statement */}
        <div className="mt-7">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e3914] dark:text-[#8bc34a] mb-2 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5" />
            <span>MISSION BRIEF</span>
          </div>
          <div className="bg-[#f2efe4] dark:bg-[#162714] border-l-4 border-[#203a16] dark:border-[#8bc34a] p-4 rounded-r-2xl">
            <p className="font-serif text-base sm:text-lg text-[#142312] dark:text-[#eaf4e5] font-bold leading-relaxed">
              "{quest.mission}"
            </p>
          </div>
        </div>

        {/* Checklist Steps (Physical Observations) */}
        <div className="mt-6 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e3914] dark:text-[#8bc34a] block">
            FIELD OBSERVATION CHECKPOINTS ({quest.steps.length})
          </span>
          <div className="space-y-2">
            {quest.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-[#f2efe4] dark:bg-[#162714] border border-[#dad1be] dark:border-[#243d1f] p-3 rounded-xl transition-all hover:border-[#1e3914] dark:hover:border-[#8bc34a]"
              >
                <div className="w-6 h-6 rounded-lg bg-[#1e3914] dark:bg-[#1b3417] text-[#f7f5ed] dark:text-[#a0db6f] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-xs text-[#142312] dark:text-[#e4eee0] leading-relaxed font-medium">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field Tip */}
        {quest.returnPrompt && (
          <div className="mt-6 p-4 rounded-2xl bg-[#ebf3e2] dark:bg-[#142613] border-2 border-[#a5ca92] dark:border-[#234220] text-xs text-[#1e3814] dark:text-[#c4dfbe] leading-relaxed font-medium">
            <strong className="block text-[11px] font-mono uppercase text-[#1b3912] dark:text-[#8bc34a] mb-1 font-bold">
              Field Philosophy:
            </strong>
            {quest.returnPrompt}
          </div>
        )}

        {/* Primary Action Button: Lock Screen & Step Outside */}
        <div className="mt-8 pt-6 border-t-2 border-[#e3dacf] dark:border-[#1f3619] space-y-3">
          <button
            onClick={onStartOutdoorMode}
            className="w-full py-4 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 tracking-wider group btn-magnetic"
          >
            <span>LOCK SCREEN & BEGIN OUTDOOR MODE</span>
            <ArrowRight className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409] group-hover:translate-x-1.5 transition-transform" />
          </button>

          <div className="flex items-center justify-between text-xs text-[#63765c] dark:text-[#8ea287] pt-2">
            <button
              onClick={onGenerateNew}
              className="flex items-center gap-1.5 hover:text-[#142312] dark:hover:text-[#f4f7ee] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Mission</span>
            </button>

            <button
              onClick={onCancel}
              className="hover:text-[#142312] dark:hover:text-[#f4f7ee] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
