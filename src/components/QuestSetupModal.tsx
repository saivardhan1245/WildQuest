import React, { useState } from 'react';
import { X } from 'lucide-react';
import { QuestDuration, QuestEnvironment, QuestDifficulty, QuestCategory, UserProfile } from '../types/quest';

interface QuestSetupModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: {
    duration: QuestDuration;
    environment: QuestEnvironment;
    difficulty: QuestDifficulty;
    category: QuestCategory;
    notes?: string;
  }) => void;
}

export const QuestSetupModal: React.FC<QuestSetupModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onGenerate
}) => {
  const [duration, setDuration] = useState<QuestDuration>(30);
  const [environment, setEnvironment] = useState<QuestEnvironment>('park');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('explorer');
  const [category, setCategory] = useState<QuestCategory>('biodiversity');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      duration,
      environment,
      difficulty,
      category,
      notes: notes.trim() || undefined
    });
  };

  const environments: { id: QuestEnvironment; label: string }[] = [
    { id: 'park', label: 'PARK' },
    { id: 'garden', label: 'GARDEN' },
    { id: 'trail', label: 'TRAIL' },
    { id: 'neighborhood', label: 'NEIGHBORHOOD' },
    { id: 'anywhere', label: 'ANYWHERE' }
  ];

  const durations: { id: QuestDuration; label: string }[] = [
    { id: 20, label: '20 MIN' },
    { id: 30, label: '30 MIN' },
    { id: 45, label: '45 MIN' },
    { id: 60, label: '60 MIN' }
  ];

  const difficulties: { id: QuestDifficulty; label: string; sub: string }[] = [
    { id: 'beginner', label: 'EASY', sub: 'Gentle observation' },
    { id: 'explorer', label: 'CURIOUS', sub: 'Active exploration' },
    { id: 'challenge', label: 'CHALLENGE', sub: 'Field naturalist tracking' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0d160c]/75 dark:bg-[#030603]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#dad2be] dark:border-[#284521] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-reveal">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5decb] dark:border-[#1e3419] pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#44662d] dark:text-[#8bc34a]">
              ADVENTURE CONFIGURATOR
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#142312] dark:text-[#f4f7ee] mt-0.5">
              Design Today's Expedition
            </h2>
            <p className="text-xs text-[#52634a] dark:text-[#8ea287]">
              Choose where you are stepping and how long you have outside.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#60705a] dark:text-[#8ea287] hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#ede7d5] dark:hover:bg-[#1a2d18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* SECTION 1: WHERE ARE YOU GOING? */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-2.5">
              WHERE ARE YOU GOING?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {environments.map((env) => {
                const isSelected = environment === env.id;
                return (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => setEnvironment(env.id)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all btn-magnetic ${
                      isSelected
                        ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] border-[#1b2d18] dark:border-[#8bc34a] shadow-xs'
                        : 'bg-[#f4efe2] dark:bg-[#162714] text-[#33462d] dark:text-[#b4c9ad] border-[#ded5c2] dark:border-[#243d1f] hover:bg-[#e9e2cf] dark:hover:bg-[#1d351b]'
                    }`}
                  >
                    {env.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: HOW MUCH TIME? */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-2.5">
              HOW MUCH TIME DO YOU HAVE?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {durations.map((d) => {
                const isSelected = duration === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all btn-magnetic ${
                      isSelected
                        ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] border-[#1b2d18] dark:border-[#8bc34a] shadow-xs'
                        : 'bg-[#f4efe2] dark:bg-[#162714] text-[#33462d] dark:text-[#b4c9ad] border-[#ded5c2] dark:border-[#243d1f] hover:bg-[#e9e2cf] dark:hover:bg-[#1d351b]'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: DIFFICULTY */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-2.5">
              INTENSITY LEVEL
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {difficulties.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={`p-3 rounded-xl border text-left transition-all btn-magnetic ${
                      isSelected
                        ? 'bg-[#1b2d18] dark:bg-[#183116] border-[#375e2e] dark:border-[#8bc34a] text-[#f7f5ed] shadow-xs'
                        : 'bg-[#f4efe2] dark:bg-[#162714] border-[#ded5c2] dark:border-[#243d1f] text-[#2c3d26] dark:text-[#b4c9ad] hover:bg-[#e9e2cf] dark:hover:bg-[#1d351b]'
                    }`}
                  >
                    <div className={`font-serif font-bold text-xs uppercase ${isSelected ? 'text-[#8bc34a]' : 'text-[#142312] dark:text-[#f4f7ee]'}`}>
                      {diff.label}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#cbdcc1]' : 'text-[#5d7056] dark:text-[#8ea287]'}`}>
                      {diff.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: OPTIONAL NATURALIST NOTES */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-1.5">
              SPECIAL REQUEST OR MOOD (OPTIONAL)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. It just rained, feeling contemplative, looking for bird activity"
              className="w-full px-4 py-3 rounded-xl bg-[#f4efe2] dark:bg-[#162714] border border-[#ded5c2] dark:border-[#243d1f] text-xs text-[#142312] dark:text-[#f4f7ee] placeholder-[#8c9c85] dark:placeholder-[#647960] focus:outline-none focus:border-[#44662d] dark:focus:border-[#8bc34a]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-sm shadow-md transition-all tracking-wider btn-magnetic"
            >
              SYNTHESIZE FIELD MISSION WITH GEMMA →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
