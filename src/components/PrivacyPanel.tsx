import React, { useState } from 'react';
import { X, ShieldCheck, HardDrive, Check, Trash2 } from 'lucide-react';
import { UserProfile } from '../types/quest';

interface PrivacyPanelProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({
  userProfile,
  isOpen,
  onClose,
  onResetData
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1c2619]/75 dark:bg-[#030603]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#d4cbba] dark:border-[#284521] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-reveal">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5decb] dark:border-[#1e3419] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3d6132] dark:text-[#8bc34a] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Telemetry Architecture</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a2517] dark:text-[#f4f7ee]">
              Privacy-First Field Ethics
            </h2>
            <p className="text-xs text-[#52604b] dark:text-[#8ea287] mt-0.5">
              Outdoor exploration is intimate. We believe location belongs to you, not an advertising profile.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#65735f] dark:text-[#8ea287] hover:text-[#1c2619] dark:hover:text-[#f4f7ee] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Pillars */}
        <div className="mt-6 space-y-4">
          {/* 1. What Stays on Your Device */}
          <div className="bg-[#f0ede1] dark:bg-[#162714] rounded-2xl p-4 sm:p-5 border border-[#ddd5c0] dark:border-[#243d1f]">
            <h3 className="font-serif font-bold text-base text-[#1c2619] dark:text-[#f4f7ee] flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
              <span>What stays on your device?</span>
            </h3>
            <ul className="text-xs text-[#4c5c46] dark:text-[#b4c9ad] space-y-1.5 list-disc pl-5 leading-relaxed">
              <li>
                <strong>All Field Journal Entries:</strong> Your completed missions, observation text, voice memos, and photos are stored in local browser storage (IndexedDB/localStorage).
              </li>
              <li>
                <strong>Outdoor Passport & Badges:</strong> Minutes outside counter, day streaks, and places visited never leave your machine.
              </li>
              <li>
                <strong>Zero Location Tracking:</strong> We never query background GPS coordinates. You choose high-level categories (e.g. "Park", "Trail") manually.
              </li>
            </ul>
          </div>

          {/* 2. Zero Ads & Analytics */}
          <div className="bg-[#f0ede1] dark:bg-[#162714] rounded-2xl p-4 sm:p-5 border border-[#ddd5c0] dark:border-[#243d1f]">
            <h3 className="font-serif font-bold text-base text-[#1c2619] dark:text-[#f4f7ee] flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
              <span>No Cookies, Trackers, or Third-Party Pixels</span>
            </h3>
            <p className="text-xs text-[#4c5c46] dark:text-[#b4c9ad] leading-relaxed">
              WildQuest contains zero tracking scripts, analytics SDKs, session replay monitors, or advertising identifiers. You don't even create an account.
            </p>
          </div>
        </div>

        {/* Local Storage Summary */}
        <div className="mt-6 p-4 rounded-2xl bg-[#e9f1e1] dark:bg-[#132412] border border-[#cbdcb9] dark:border-[#213d1e] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-[#23351d] dark:text-[#f4f7ee]">Current Stored Missions:</div>
            <div className="text-[11px] text-[#4d6641] dark:text-[#8bc34a]">
              {userProfile.completedQuests.length} records saved strictly in browser
            </div>
          </div>

          {resetConfirmed ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetData();
                  setResetConfirmed(false);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#b73229] text-white font-bold text-xs hover:bg-[#99251d] transition-colors"
              >
                Confirm Erase Everything
              </button>
              <button
                onClick={() => setResetConfirmed(false)}
                className="px-3 py-1.5 rounded-lg bg-[#e2dac9] dark:bg-[#1b2f18] text-[#1c2619] dark:text-[#f4f7ee] text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirmed(true)}
              className="flex items-center gap-1.5 text-xs text-[#8c2d25] dark:text-[#e06d64] font-bold hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Erase All Local Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
