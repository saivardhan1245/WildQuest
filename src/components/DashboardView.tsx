import React from 'react';
import { Compass, Sparkles, BookOpen, ArrowRight, Eye, Lock, Camera, Footprints, Layers, MapPin } from 'lucide-react';
import { UserProfile, DiscoveryRecord } from '../types/quest';

interface DashboardViewProps {
  userProfile: UserProfile;
  onStartQuest: () => void;
  onStartMysteryQuest: () => void;
  onOpenRecordDiscovery: () => void;
  onTurnDiscoveryIntoQuest: (discovery: DiscoveryRecord) => void;
  onFollowCuriosity?: (curiosity: { observation: string; question: string; missionSeed: string }) => void;
  onViewPassport: () => void;
  onViewAccount: () => void;
  onOpenAIModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onStartQuest,
  onStartMysteryQuest,
  onOpenRecordDiscovery,
  onTurnDiscoveryIntoQuest,
  onFollowCuriosity,
  onViewPassport,
  onViewAccount,
  onOpenAIModal,
}) => {
  const isNewUser = userProfile.completedQuests.length === 0;
  const recentQuests = userProfile.completedQuests.slice(0, 3);
  const recentDiscoveries = userProfile.discoveries.slice(0, 3);
  const latestCuriosity = userProfile.curiosityChain[0];
  const lastCompletedQuest = userProfile.completedQuests[0];

  const stage = userProfile.currentProgressionStage;

  return (
    <div className="space-y-8 animate-reveal">
      {/* SIGNATURE FEATURE 1: ADAPTIVE QUEST EVOLUTION BANNER */}
      <div className="bg-[#f0ede1] dark:bg-[#122011] border-2 border-[#dad1be] dark:border-[#22391b] rounded-3xl p-6 sm:p-7 shadow-xs field-card-deckle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#233f19] dark:text-[#8bc34a]">
                ADAPTIVE QUEST EVOLUTION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1b2d18] text-[#9ce06a] dark:bg-[#162e14] dark:text-[#8bc34a] font-bold">
                STAGE: {stage.toUpperCase()}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#142312] dark:text-[#f4f7ee] mt-1">
              {stage === 'observe'
                ? 'Phase 1: Sensory Observation Baseline'
                : stage === 'learn'
                ? 'Phase 2: Pattern & Comparative Exploration'
                : 'Phase 3: Deep Micro-Ecosystem Immersion'}
            </h3>
            <p className="text-xs text-[#283f21] dark:text-[#9eb599] mt-1 max-w-xl leading-relaxed font-medium">
              {isNewUser
                ? 'Every completed quest, real discovery, and difficulty feedback directly progresses future quests. Trajectory: observe → learn → explore deeper.'
                : `Progressed from Quest #${userProfile.completedQuests.length} ("${lastCompletedQuest?.quest.title}"). Feedback (${lastCompletedQuest?.difficultyFeedback}) actively calibrates upcoming quest parameters.`}
            </p>
          </div>

          {/* Stepper Progression Graphic */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-[#faf8f2] dark:bg-[#162914] p-2.5 rounded-2xl border border-[#dad1be] dark:border-[#253f20]">
            <div className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-colors ${
              stage === 'observe'
                ? 'bg-[#233f19] text-white dark:bg-[#8bc34a] dark:text-[#0b1409]'
                : 'text-[#233f19] dark:text-[#a0db6f]'
            }`}>
              1. OBSERVE
            </div>
            <span className="text-xs text-[#233f19] dark:text-[#8bc34a] font-bold">→</span>
            <div className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-colors ${
              stage === 'learn'
                ? 'bg-[#233f19] text-white dark:bg-[#8bc34a] dark:text-[#0b1409]'
                : 'text-[#233f19] dark:text-[#a0db6f]'
            }`}>
              2. LEARN
            </div>
            <span className="text-xs text-[#233f19] dark:text-[#8bc34a] font-bold">→</span>
            <div className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-colors ${
              stage === 'explore_deeper'
                ? 'bg-[#233f19] text-white dark:bg-[#8bc34a] dark:text-[#0b1409]'
                : 'text-[#233f19] dark:text-[#a0db6f]'
            }`}>
              3. EXPLORE DEEPER
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE FEATURE 2: ACTIVE CURIOSITY CHAIN SPARK (if user completed a quest) */}
      {latestCuriosity && (
        <div className="bg-[#eef5e7] dark:bg-[#132712] border-2 border-[#9fc78c] dark:border-[#295024] rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1e3914] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  ?
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1e3914] dark:text-[#8bc34a]">
                  ACTIVE CURIOSITY CHAIN SPARK
                </span>
              </div>
              <h4 className="font-serif text-lg sm:text-xl font-extrabold text-[#142312] dark:text-[#f4f7ee]">
                "{latestCuriosity.curiosityQuestion}"
              </h4>
              <p className="text-xs text-[#2b4224] dark:text-[#a2be9b] font-medium">
                Triggered by your observation: <em className="text-[#142312] dark:text-[#f4f7ee] font-semibold">"{latestCuriosity.userObservation}"</em>
              </p>
            </div>

            {onFollowCuriosity && (
              <button
                onClick={() =>
                  onFollowCuriosity({
                    observation: latestCuriosity.userObservation,
                    question: latestCuriosity.curiosityQuestion,
                    missionSeed: latestCuriosity.nextMissionSeed,
                  })
                }
                className="px-5 py-3 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-xs transition-all shadow-sm flex items-center gap-2 flex-shrink-0 self-start sm:self-auto btn-magnetic"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9be36e] dark:text-[#0b1409]" />
                <span>FOLLOW THIS CURIOSITY →</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PRIMARY MISSION LAUNCHERS: STANDARD + SIGNATURE FEATURE 4 (MYSTERY QUEST) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* SIGNATURE FEATURE 4: PROMINENT MYSTERY QUEST CARD */}
        <div className="md:col-span-6 bg-[#162613] text-[#f7f5ed] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden border-2 border-[#2f5123] dark:border-[#27441d] forest-canopy-bg tech-card group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8bc34a]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-[#2d4d21] pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a1db6f] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#8bc34a]" />
                <span>SEALED DOSSIER MODE</span>
              </span>
              <span className="text-[10px] font-mono text-[#a5c39c] uppercase font-semibold">
                20–30 MIN · OUTDOORS
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f7f5ed] leading-tight">
              MYSTERY QUEST
            </h3>
            
            <p className="mt-2 text-xs sm:text-sm text-[#d0dfcc] leading-relaxed">
              Step outside without knowing your mission beforehand. The challenge unseals only after you step out into the real world.
            </p>

            {/* Locked Preview Badge */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#0c180a]/80 border border-[#26441b] text-center space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#a5c39c] uppercase block font-semibold">
                MISSION BRIEFING
              </span>
              <span className="text-xs font-serif font-bold text-[#e6f2e1] block">
                [LOCKED UNTIL YOU STEP OUTSIDE]
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#29491e]">
            <button
              onClick={onStartMysteryQuest}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#8bc34a] hover:bg-[#7cb73f] text-[#0b1409] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 group btn-magnetic"
            >
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>UNSEAL & REVEAL MYSTERY QUEST</span>
            </button>
          </div>
        </div>

        {/* CUSTOM EXPEDITION GENERATOR */}
        <div className="md:col-span-6 bg-[#faf8f2] dark:bg-[#111e10] text-[#142312] dark:text-[#f4f7ee] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs border-2 border-[#dad1be] dark:border-[#22391b] field-card-deckle">
          <div>
            <div className="flex items-center justify-between border-b border-[#e5decb] dark:border-[#1e3419] pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#233f19] dark:text-[#8bc34a] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>EXPEDITION PLANNER</span>
              </span>
              <span className="text-[10px] font-mono text-[#384e30] dark:text-[#8ea287] font-semibold">
                20 TO 60 MIN
              </span>
            </div>

            <h3 className="font-serif text-3xl font-extrabold text-[#142312] dark:text-[#f4f7ee]">
              Tailored Mission
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#2b4124] dark:text-[#9cb195] leading-relaxed">
              Choose your terrain (Park, Neighborhood, Trail, Garden) and focus (Biodiversity, Detective, Sensory, Mindful) for an on-device mission.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-[#f2efe4] dark:bg-[#162714] border border-[#dcd3be] dark:border-[#253f20]">
                <span className="font-bold block text-[#142312] dark:text-[#f4f7ee]">Gemma 2:2B</span>
                <span className="text-[10px] text-[#364c2f] dark:text-[#8ea287] font-semibold">Local On-Device</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f2efe4] dark:bg-[#162714] border border-[#dcd3be] dark:border-[#253f20]">
                <span className="font-bold block text-[#142312] dark:text-[#f4f7ee]">100% Offline</span>
                <span className="text-[10px] text-[#364c2f] dark:text-[#8ea287] font-semibold">Trail Ready</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e5decb] dark:border-[#1e3419]">
            <button
              onClick={onStartQuest}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 group btn-magnetic"
            >
              <span>CONFIGURE & PLAN MISSION</span>
              <ArrowRight className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* SIGNATURE FEATURE 3: DISCOVERY → NEXT QUEST SECTION */}
      <div className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#dad1be] dark:border-[#22391b] rounded-3xl p-6 sm:p-8 shadow-xs field-card-deckle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5decb] dark:border-[#1e3419] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#233f19] dark:text-[#8bc34a]">
              <Eye className="w-3.5 h-3.5" />
              <span>FIELD SPECIMEN DISCOVERIES</span>
            </div>
            <h3 className="font-serif text-2xl font-extrabold text-[#142312] dark:text-[#f4f7ee] mt-0.5">
              Turn a Discovery into a Quest
            </h3>
            <p className="text-xs text-[#2b4124] dark:text-[#9bb295]">
              Found a strange leaf, curious insect, or stone? Log it, and Gemma will synthesize a mission that directly branches from it.
            </p>
          </div>

          <button
            onClick={onOpenRecordDiscovery}
            className="px-4 py-2.5 rounded-2xl bg-[#1e3914] hover:bg-[#14280e] text-[#f7f5ed] dark:bg-[#8bc34a] dark:text-[#0b1409] text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto btn-magnetic shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>+ RECORD FIELD DISCOVERY</span>
          </button>
        </div>

        {recentDiscoveries.length === 0 ? (
          <div className="py-6 px-4 rounded-2xl bg-[#f2efe4] dark:bg-[#162714] border border-dashed border-[#cfc4ad] dark:border-[#294622] text-center text-xs text-[#2e4526] dark:text-[#8ea287]">
            No discoveries logged yet. While outdoors, spot something curious and click <strong>"+ Record Field Discovery"</strong>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentDiscoveries.map((disc) => (
              <div
                key={disc.id}
                className="bg-[#f4f0e5] dark:bg-[#162714] p-4 rounded-2xl border border-[#ded5c2] dark:border-[#253f20] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#334b2c] dark:text-[#8ea287]">
                    <span className="uppercase font-bold text-[#1e3914] dark:text-[#8bc34a]">
                      {disc.categoryLabel}
                    </span>
                    <span className="font-semibold">{new Date(disc.recordedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-serif text-sm font-bold text-[#142312] dark:text-[#f4f7ee] mt-1.5 leading-snug">
                    "{disc.text}"
                  </p>
                </div>

                <button
                  onClick={() => onTurnDiscoveryIntoQuest(disc)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 btn-magnetic"
                >
                  <Sparkles className="w-3 h-3 text-[#9be36e] dark:text-[#0b1409]" />
                  <span>TURN THIS DISCOVERY INTO A QUEST</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VERIFIED SUMMARY METRICS (FEATURE 5: NO FAKE XP OR FABRICATIONS) */}
      <div className="bg-[#faf8f2] dark:bg-[#111e10] rounded-3xl border-2 border-[#dad2be] dark:border-[#243c1e] p-6 sm:p-8 field-card-deckle space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5decb] dark:border-[#22371c] pb-3">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#233f19] dark:text-[#8bc34a]">
              EXPLORATION JOURNAL STATS
            </span>
            <h4 className="font-serif text-xl font-extrabold text-[#142312] dark:text-[#f4f7ee]">
              Verified Physical Activity
            </h4>
          </div>
          <button
            onClick={onViewPassport}
            className="text-xs font-bold text-[#1b2d18] dark:text-[#8bc34a] hover:underline flex items-center gap-1"
          >
            <span>OPEN COMPLETE PASSPORT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-[#f2efe4] dark:bg-[#162714] p-4 rounded-2xl border border-[#ded5c2] dark:border-[#284221]">
            <div className="font-serif font-extrabold text-3xl text-[#142312] dark:text-[#f4f7ee]">
              {userProfile.completedQuests.length}
            </div>
            <div className="text-[10px] font-mono text-[#2f4628] dark:text-[#8ea287] uppercase mt-1 font-bold">
              Verified Missions
            </div>
          </div>

          <div className="bg-[#f2efe4] dark:bg-[#162714] p-4 rounded-2xl border border-[#ded5c2] dark:border-[#284221]">
            <div className="font-serif font-extrabold text-3xl text-[#142312] dark:text-[#f4f7ee]">
              {userProfile.totalMinutesOutside}m
            </div>
            <div className="text-[10px] font-mono text-[#2f4628] dark:text-[#8ea287] uppercase mt-1 font-bold">
              Real Minutes Outside
            </div>
          </div>

          <div className="bg-[#f2efe4] dark:bg-[#162714] p-4 rounded-2xl border border-[#ded5c2] dark:border-[#284221]">
            <div className="font-serif font-extrabold text-3xl text-[#142312] dark:text-[#f4f7ee]">
              {userProfile.discoveriesCount}
            </div>
            <div className="text-[10px] font-mono text-[#2f4628] dark:text-[#8ea287] uppercase mt-1 font-bold">
              Specimens Logged
            </div>
          </div>

          <div className="bg-[#f2efe4] dark:bg-[#162714] p-4 rounded-2xl border border-[#ded5c2] dark:border-[#284221]">
            <div className="font-serif font-extrabold text-3xl text-[#142312] dark:text-[#f4f7ee]">
              {userProfile.verifiedPlaces.length}
            </div>
            <div className="text-[10px] font-mono text-[#2f4628] dark:text-[#8ea287] uppercase mt-1 font-bold">
              Verified Places
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
