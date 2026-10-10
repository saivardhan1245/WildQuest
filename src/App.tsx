import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Quest,
  CompletedQuest,
  QuestDuration,
  QuestEnvironment,
  QuestDifficulty,
  QuestCategory,
  DiscoveryRecord
} from './types/quest';
import {
  loadUserProfile,
  saveUserProfile,
  recordCompletedQuest,
  recordUserDiscovery,
  linkDiscoveryToQuest,
  resetAllData
} from './services/storage';
import { providerRegistry } from './services/ai/providerRegistry';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { FieldPassportView } from './components/FieldPassportView';
import { QuestSetupModal } from './components/QuestSetupModal';
import { QuestGenerationCinematic } from './components/QuestGenerationCinematic';
import { QuestCardView } from './components/QuestCardView';
import { OutdoorModeView } from './components/OutdoorModeView';
import { QuestReflectionModal } from './components/QuestReflectionModal';
import { MysteryQuestModal } from './components/MysteryQuestModal';
import { DiscoveryRecordModal } from './components/DiscoveryRecordModal';
import { AIProviderModal } from './components/AIProviderModal';
import { PrivacyPanel } from './components/PrivacyPanel';
import { WifiOff, Sparkles, Compass } from 'lucide-react';
import { ENVIRONMENT_NAMES } from './utils/categories';
import { ThemeProvider } from './context/ThemeContext';

function MainApp() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [currentView, setCurrentView] = useState<'home' | 'passport' | 'outdoor'>('home');

  // Modals & Active Flows
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isMysteryModalOpen, setIsMysteryModalOpen] = useState<boolean>(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState<boolean>(false);
  const [isCinematicActive, setIsCinematicActive] = useState<boolean>(false);
  const [cinematicParams, setCinematicParams] = useState<{ duration: number; envName: string }>({
    duration: 30,
    envName: 'Park',
  });
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [completedDurationMinutes, setCompletedDurationMinutes] = useState<number>(30);
  const [isReflectionOpen, setIsReflectionOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Status notifications
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  // Monitor online/offline state for true trail readiness
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setBannerNotice('Online connection active.');
      setTimeout(() => setBannerNotice(null), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setBannerNotice('You are offline. WildQuest is operating in 100% on-device trail mode.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Launch a new quest generation
  const handleGenerateQuest = async (config: {
    duration: QuestDuration;
    environment: QuestEnvironment;
    difficulty: QuestDifficulty;
    category: QuestCategory;
    notes?: string;
  }) => {
    setIsSetupOpen(false);
    const envMeta = ENVIRONMENT_NAMES[config.environment] || ENVIRONMENT_NAMES.park;
    setCinematicParams({ duration: config.duration, envName: envMeta.name });
    setIsCinematicActive(true);

    try {
      const startTime = Date.now();
      const result = await providerRegistry.generateQuestWithFallback(
        userProfile.activeProviderId,
        {
          duration: config.duration,
          environment: config.environment,
          difficulty: config.difficulty,
          category: config.category,
          userProfile,
          notes: config.notes,
        }
      );

      const elapsed = Date.now() - startTime;
      const minDelay = 2000;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      setActiveQuest(result.quest);

      if (result.fallbackOccurred) {
        setBannerNotice('Notice: Local Gemma was on standby; mission generated via on-device adaptive engine.');
        setTimeout(() => setBannerNotice(null), 6000);
      }
    } catch (err: any) {
      console.error('Quest generation failed:', err);
    } finally {
      setIsCinematicActive(false);
    }
  };

  // Launch Mystery Quest (Feature 4)
  const handleLaunchMysteryQuest = async (durationMinutes: 20 | 30): Promise<Quest> => {
    const result = await providerRegistry.generateQuestWithFallback(
      userProfile.activeProviderId,
      {
        duration: durationMinutes,
        environment: 'park',
        difficulty: 'explorer',
        category: 'mindful_observation',
        userProfile,
        isMystery: true,
      }
    );
    setActiveQuest(result.quest);
    return result.quest;
  };

  // Turn a real discovery into a quest (Feature 3)
  const handleTurnDiscoveryIntoQuest = async (discovery: DiscoveryRecord) => {
    setIsDiscoveryModalOpen(false);
    const envMeta = ENVIRONMENT_NAMES[discovery.environment] || ENVIRONMENT_NAMES.park;
    setCinematicParams({ duration: 30, envName: envMeta.name });
    setIsCinematicActive(true);

    try {
      const startTime = Date.now();
      const result = await providerRegistry.generateQuestWithFallback(
        userProfile.activeProviderId,
        {
          duration: 30,
          environment: discovery.environment,
          difficulty: 'explorer',
          category: 'biodiversity',
          userProfile,
          discoveryContext: {
            id: discovery.id,
            text: discovery.text,
            category: discovery.categoryLabel,
          },
        }
      );

      const elapsed = Date.now() - startTime;
      const minDelay = 2000;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      // Link discovery in storage
      const updatedProfile = linkDiscoveryToQuest(
        userProfile,
        discovery.id,
        result.quest.id,
        result.quest.title
      );
      setUserProfile(updatedProfile);

      setActiveQuest(result.quest);
      setCurrentView('home');
      setBannerNotice(`🌿 Quest spawned from your discovery: "${discovery.text.slice(0, 30)}..."`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: any) {
      console.error('Failed to turn discovery into quest:', err);
    } finally {
      setIsCinematicActive(false);
    }
  };

  // Follow a Curiosity Chain item into a new quest (Feature 2)
  const handleFollowCuriosity = async (curiosity: {
    observation: string;
    question: string;
    missionSeed: string;
  }) => {
    setCinematicParams({ duration: 30, envName: 'Park' });
    setIsCinematicActive(true);

    try {
      const startTime = Date.now();
      const result = await providerRegistry.generateQuestWithFallback(
        userProfile.activeProviderId,
        {
          duration: 30,
          environment: 'park',
          difficulty: 'explorer',
          category: 'nature_detective',
          userProfile,
          curiosityContext: curiosity,
        }
      );

      const elapsed = Date.now() - startTime;
      const minDelay = 2000;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      setActiveQuest(result.quest);
      setCurrentView('home');
      setBannerNotice(`✨ Exploring curiosity: "${curiosity.question.slice(0, 35)}..."`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: any) {
      console.error('Failed to generate curiosity quest:', err);
    } finally {
      setIsCinematicActive(false);
    }
  };

  // Record a new discovery directly
  const handleSaveDiscovery = (discovery: DiscoveryRecord) => {
    const updated = recordUserDiscovery(userProfile, discovery);
    setUserProfile(updated);
    setBannerNotice('🌿 Specimen logged in your Field Passport!');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Start Outdoor Mode from Card View
  const handleBeginOutdoorMode = (questToStart?: Quest) => {
    if (questToStart) {
      setActiveQuest(questToStart);
    }
    setCurrentView('outdoor');
  };

  // User returned from outdoor quest
  const handleFinishOutdoorMode = (minutesSpent: number) => {
    setCompletedDurationMinutes(minutesSpent);
    setCurrentView('home');
    setIsReflectionOpen(true);
  };

  // Cancel quest
  const handleCancelQuest = () => {
    setCurrentView('home');
    setActiveQuest(null);
  };

  // Save reflection and stamp passport strictly from real activity
  const handleSaveReflection = (completedQuest: CompletedQuest, newDiscovery?: DiscoveryRecord) => {
    let updated = recordCompletedQuest(userProfile, completedQuest);
    if (newDiscovery) {
      updated = recordUserDiscovery(updated, newDiscovery);
    }
    setUserProfile(updated);
    setIsReflectionOpen(false);
    setActiveQuest(null);
    setCurrentView('passport');
    setBannerNotice('🌿 Expedition stamped in your Field Passport!');
    setTimeout(() => setBannerNotice(null), 5000);
  };

  // Provider update
  const handleUpdateProvider = (providerId: 'local-gemma' | 'offline-adaptive' | 'gemini-dev') => {
    const updated = { ...userProfile, activeProviderId: providerId };
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  // Reset local data to clean initial state
  const handleResetData = () => {
    const fresh = resetAllData();
    setUserProfile(fresh);
    setActiveQuest(null);
    setCurrentView('home');
    setBannerNotice('Field ledger reset to 0.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3e9] dark:bg-[#0b120a] text-[#142312] dark:text-[#edebe1] flex flex-col font-sans selection:bg-[#3d6132] selection:text-[#f7f5ed] dark:selection:bg-[#8bc34a] dark:selection:text-[#0b1409] paper-texture transition-colors duration-300">
      {/* Offline / Notification Banner */}
      {(isOffline || bannerNotice) && (
        <div className="bg-[#1b2d18] dark:bg-[#152713] text-[#eaf3e1] text-xs py-2 px-4 text-center font-medium border-b border-[#2d4726] dark:border-[#2b4822] flex items-center justify-center gap-2 transition-all">
          {isOffline ? <WifiOff className="w-3.5 h-3.5 text-[#8bc34a]" /> : <Sparkles className="w-3.5 h-3.5 text-[#8bc34a]" />}
          <span>{bannerNotice || 'Trail Mode Active: Operating 100% offline with on-device intelligence.'}</span>
        </div>
      )}

      {/* Navigation (hidden in distraction-free outdoor mode) */}
      {currentView !== 'outdoor' && (
        <Navbar
          userProfile={userProfile}
          currentView={currentView}
          onNavigate={(v) => {
            setActiveQuest(null);
            setCurrentView(v);
          }}
          onOpenAIModal={() => setIsAIModalOpen(true)}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          onStartNewQuest={() => setIsSetupOpen(true)}
          onScrollToHowItWorks={() => scrollToSection('how-it-works-anchor')}
          onScrollToOpenAI={() => scrollToSection('open-ai-anchor')}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: Outdoor Mode (Screen Gets Out Of The Way) */}
        {currentView === 'outdoor' && activeQuest ? (
          <OutdoorModeView
            quest={activeQuest}
            onFinishQuest={handleFinishOutdoorMode}
            onCancelQuest={handleCancelQuest}
          />
        ) : activeQuest ? (
          /* VIEW 2: Premium Physical Field Guide Card */
          <QuestCardView
            quest={activeQuest}
            onStartOutdoorMode={() => handleBeginOutdoorMode()}
            onGenerateNew={() => setIsSetupOpen(true)}
            onCancel={handleCancelQuest}
          />
        ) : currentView === 'passport' ? (
          /* VIEW 3: Field Passport (Explorer's Journal) */
          <FieldPassportView
            userProfile={userProfile}
            onBack={() => setCurrentView('home')}
            onStartQuest={() => setIsSetupOpen(true)}
            onResetData={handleResetData}
            onTurnDiscoveryIntoQuest={handleTurnDiscoveryIntoQuest}
          />
        ) : (
          /* VIEW 4: Landing Page & Expedition Hub */
          <div className="space-y-20">
            <LandingHero
              onStartQuest={() => setIsSetupOpen(true)}
              onOpenHowItWorks={() => scrollToSection('how-it-works-anchor')}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />

            {/* Expedition Hub Section */}
            <div className="pt-6 border-t-2 border-[#ded7c4] dark:border-[#21381b]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#44662d] dark:text-[#8bc34a]">
                    EXPEDITION HUB
                  </span>
                  <h2 className="font-serif text-3xl font-extrabold text-[#142312] dark:text-[#f4f7ee] mt-0.5">
                    Your Field Activity
                  </h2>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setIsMysteryModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-[#23381e] hover:bg-[#192b15] text-[#f7f5ed] font-extrabold text-xs transition-all shadow-xs flex items-center gap-2 btn-magnetic border border-[#3b5d2e]"
                  >
                    <span>MYSTERY QUEST</span>
                  </button>
                  <button
                    onClick={() => setIsSetupOpen(true)}
                    className="px-5 py-2.5 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-xs transition-all shadow-xs flex items-center gap-2 btn-magnetic"
                  >
                    <Compass className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409]" />
                    <span>+ PLAN MISSION</span>
                  </button>
                </div>
              </div>

              <DashboardView
                userProfile={userProfile}
                onStartQuest={() => setIsSetupOpen(true)}
                onStartMysteryQuest={() => setIsMysteryModalOpen(true)}
                onOpenRecordDiscovery={() => setIsDiscoveryModalOpen(true)}
                onTurnDiscoveryIntoQuest={handleTurnDiscoveryIntoQuest}
                onFollowCuriosity={handleFollowCuriosity}
                onViewPassport={() => setCurrentView('passport')}
                onViewAccount={() => setCurrentView('passport')}
                onOpenAIModal={() => setIsAIModalOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Cinematic Generation Overlay */}
      {isCinematicActive && (
        <QuestGenerationCinematic
          durationMinutes={cinematicParams.duration}
          environmentName={cinematicParams.envName}
        />
      )}

      {/* Quest Setup Modal */}
      <QuestSetupModal
        userProfile={userProfile}
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onGenerate={handleGenerateQuest}
      />

      {/* Mystery Quest Modal (Feature 4) */}
      <MysteryQuestModal
        isOpen={isMysteryModalOpen}
        onClose={() => setIsMysteryModalOpen(false)}
        onLaunchMystery={handleLaunchMysteryQuest}
        onBeginOutdoorMode={handleBeginOutdoorMode}
      />

      {/* Record Discovery Modal (Feature 3) */}
      <DiscoveryRecordModal
        isOpen={isDiscoveryModalOpen}
        userProfile={userProfile}
        onClose={() => setIsDiscoveryModalOpen(false)}
        onSaveDiscovery={handleSaveDiscovery}
        onTurnIntoQuest={handleTurnDiscoveryIntoQuest}
      />

      {/* Reflection Modal (Feature 1, 2, 5) */}
      {isReflectionOpen && activeQuest && (
        <QuestReflectionModal
          quest={activeQuest}
          durationMinutesSpent={completedDurationMinutes}
          userProfile={userProfile}
          isOpen={isReflectionOpen}
          onSave={handleSaveReflection}
          onClose={() => {
            setIsReflectionOpen(false);
            setActiveQuest(null);
          }}
          onFollowCuriosity={handleFollowCuriosity}
        />
      )}

      {/* AI Provider Inspector Modal */}
      <AIProviderModal
        userProfile={userProfile}
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onUpdateProvider={handleUpdateProvider}
      />

      {/* Privacy Panel */}
      <PrivacyPanel
        userProfile={userProfile}
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onResetData={handleResetData}
      />

      {/* Editorial Footer */}
      {currentView !== 'outdoor' && (
        <footer className="mt-auto border-t-2 border-[#ded7c4] dark:border-[#21381b] py-12 px-4 text-center bg-[#f0ede0]/70 dark:bg-[#0c140a]/80 transition-colors">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="font-serif font-extrabold text-xl tracking-[0.2em] text-[#142312] dark:text-[#f4f7ee]">
              WILDQUEST
            </div>
            <p className="font-serif italic text-sm text-[#384e2f] dark:text-[#a0b59b] max-w-md mx-auto">
              "AI gives you the question. The real world gives you the answer."
            </p>
            <div className="text-[11px] font-mono text-[#6c7f66] dark:text-[#8ea287] tracking-widest pt-2">
              OPEN-WEIGHT GEMMA · FIELD EXPEDITIONS · TOUCH GRASS
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
