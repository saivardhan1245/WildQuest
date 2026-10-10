import React from 'react';
import { Compass, BookOpen, Cpu, Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types/quest';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  userProfile: UserProfile;
  currentView: 'home' | 'passport' | 'outdoor';
  onNavigate: (view: 'home' | 'passport') => void;
  onOpenAIModal: () => void;
  onOpenPrivacyModal: () => void;
  onStartNewQuest: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  currentView,
  onNavigate,
  onOpenAIModal,
  onOpenPrivacyModal,
  onStartNewQuest,
  onScrollToHowItWorks,
  onScrollToOpenAI
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-[#f6f3e9]/90 dark:bg-[#0c140b]/90 backdrop-blur-md border-b border-[#ded7c4] dark:border-[#21321d] px-4 sm:px-6 lg:px-10 py-3.5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group focus-visible:outline-none rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1b2d18] dark:bg-[#1f371a] text-[#eef6e6] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-[#142312] dark:group-hover:bg-[#284822] transition-all">
            <Compass className="w-5 h-5 text-[#8bc34a]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-extrabold text-xl tracking-tight text-[#142312] dark:text-[#f4f7ee]">
                WILDQUEST
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold bg-[#e3eed4] dark:bg-[#1d3119] text-[#243f1d] dark:text-[#a0db6f] px-2 py-0.5 rounded-full border border-[#c4dcad] dark:border-[#35532c]">
                Gemma 2
              </span>
            </div>
            <p className="text-[11px] text-[#5e6e58] dark:text-[#8ea287] hidden sm:block tracking-wide">
              Missions that get you outside
            </p>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-[#40503a] dark:text-[#9fb297]">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'home'
                ? 'text-[#142312] dark:text-[#f4f7ee] bg-[#eae4d2] dark:bg-[#1a2d17] font-bold'
                : 'hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#efece0] dark:hover:bg-[#152312]'
            }`}
          >
            Quest Hub
          </button>
          <button
            onClick={() => onNavigate('passport')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'passport'
                ? 'text-[#142312] dark:text-[#f4f7ee] bg-[#eae4d2] dark:bg-[#1a2d17] font-bold'
                : 'hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#efece0] dark:hover:bg-[#152312]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Field Passport</span>
            {userProfile.completedQuests.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#e66b27]" />
            )}
          </button>
          <button
            onClick={onScrollToHowItWorks}
            className="px-3 py-1.5 rounded-lg hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#efece0] dark:hover:bg-[#152312] transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={onScrollToOpenAI}
            className="px-3 py-1.5 rounded-lg hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#efece0] dark:hover:bg-[#152312] transition-colors"
          >
            Open AI
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl text-[#4a5a43] dark:text-[#9fb297] hover:text-[#142312] dark:hover:text-[#f4f7ee] bg-transparent hover:bg-[#ede7d5] dark:hover:bg-[#1b2f18] border border-transparent hover:border-[#ded7c4] dark:hover:border-[#2f4826] transition-all btn-magnetic"
            title={theme === 'dark' ? 'Switch to Field Paper (Light)' : 'Switch to Night Canopy (Dark)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#e8c15a]" />
            ) : (
              <Moon className="w-4 h-4 text-[#3d6132]" />
            )}
          </button>

          {/* AI Inspector */}
          <button
            onClick={onOpenAIModal}
            className="p-2 rounded-xl text-[#4a5a43] dark:text-[#9fb297] hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#ede7d5] dark:hover:bg-[#1b2f18] border border-transparent hover:border-[#ded7c4] dark:hover:border-[#2f4826] transition-all"
            title="Inspect Gemma AI Provider Architecture"
          >
            <Cpu className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
          </button>

          {/* Privacy Guarantee */}
          <button
            onClick={onOpenPrivacyModal}
            className="p-2 rounded-xl text-[#4a5a43] dark:text-[#9fb297] hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#ede7d5] dark:hover:bg-[#1b2f18] border border-transparent hover:border-[#ded7c4] dark:hover:border-[#2f4826] transition-all"
            title="100% Local Privacy & Zero Telemetry"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Primary Start Quest CTA */}
          {currentView !== 'outdoor' && (
            <button
              onClick={onStartNewQuest}
              className="ml-1 px-4 py-2 rounded-xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 group btn-magnetic"
            >
              <span>START QUEST</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8bc34a] dark:text-[#0b1409] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
