import React, { useState } from 'react';
import {
  BookOpen,
  MapPin,
  Sparkles,
  ArrowLeft,
  Download,
  RotateCcw,
  Share2,
  Compass,
  Footprints,
  Eye,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserProfile, CompletedQuest, DiscoveryRecord } from '../types/quest';
import { CATEGORIES, ENVIRONMENT_NAMES } from '../utils/categories';

interface FieldPassportViewProps {
  userProfile: UserProfile;
  onBack: () => void;
  onStartQuest: () => void;
  onResetData: () => void;
  onTurnDiscoveryIntoQuest?: (discovery: DiscoveryRecord) => void;
}

export const FieldPassportView: React.FC<FieldPassportViewProps> = ({
  userProfile,
  onBack,
  onStartQuest,
  onResetData,
  onTurnDiscoveryIntoQuest
}) => {
  const [activeTab, setActiveTab] = useState<'missions' | 'discoveries' | 'curiosity'>('missions');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const isNewUser = userProfile.completedQuests.length === 0 && userProfile.discoveries.length === 0;
  const verifiedPlacesCount = userProfile.verifiedPlaces.length;
  const verifiedDiscoveriesCount = userProfile.discoveriesCount;

  const handleExportJournal = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `wildquest-field-journal-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShareSummary = () => {
    const text = `🌿 WildQuest Field Passport:
• ${userProfile.totalMinutesOutside}m verified time outside
• ${userProfile.completedQuests.length} real missions stamped
• ${verifiedDiscoveriesCount} natural discoveries logged
• Progression Stage: ${userProfile.currentProgressionStage.toUpperCase()}
Zero fake stats · Real physical presence.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6 px-2 animate-reveal">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-[#44662d] dark:text-[#8bc34a] hover:text-[#142312] dark:hover:text-[#f4f7ee] transition-colors btn-magnetic"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO EXPEDITION HUB</span>
        </button>

        <div className="flex items-center gap-2">
          {!isNewUser && (
            <>
              <button
                onClick={handleShareSummary}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#faf8f2] dark:bg-[#152513] text-[#2c3d26] dark:text-[#e4ede0] border border-[#d6cfba] dark:border-[#2b4423] hover:bg-[#ede7d4] dark:hover:bg-[#1f371c] transition-colors btn-magnetic"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedNotification ? 'Copied!' : 'Share Journal'}</span>
              </button>
              <button
                onClick={handleExportJournal}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] hover:bg-[#122110] dark:hover:bg-[#7cb73f] transition-colors btn-magnetic font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Journal (JSON)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Explorer's Physical Field Journal Cover */}
      <div className="bg-[#1b2d18] dark:bg-[#0e1b0c] text-[#f6f3e9] rounded-3xl p-8 sm:p-12 border-2 border-[#335326] dark:border-[#27461e] shadow-xl relative overflow-hidden forest-canopy-bg tech-card">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#8bc34a] mb-2">
              <Compass className="w-4 h-4" />
              <span>OFFICIAL NATURALIST LEDGER</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-[#f7f5ed]">
              FIELD PASSPORT
            </h1>
            <p className="text-xs sm:text-sm text-[#cbdcc1] dark:text-[#a8c29d] mt-2 max-w-lg leading-relaxed">
              {isNewUser
                ? 'Your passport is pristine. Step outside on your first mission to stamp this ledger.'
                : 'A verified tactile register of physical presence, living observations, and minutes outside. No XP. No fake streaks.'}
            </p>
          </div>

          {/* Touch Grass Official Field Badge with Real Progression Stage */}
          <div className="ink-stamp p-4 rounded-2xl bg-[#233b20]/60 dark:bg-[#1a3118]/80 border-2 border-[#8bc34a]/60 text-center flex-shrink-0 self-start md:self-auto">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#a5d679] block">
              ADAPTIVE STAGE
            </span>
            <span className="font-serif font-extrabold text-sm sm:text-base text-[#f6fbf0] mt-1 block uppercase">
              {userProfile.currentProgressionStage}
            </span>
            <span className="text-[9px] font-mono text-[#b3cc9f] block mt-1">
              OBSERVE → LEARN → DEEPER
            </span>
          </div>
        </div>

        {/* 4 Summary Real Field Counts (Strictly Verified, No Gamification XP) */}
        <div className="mt-8 pt-6 border-t border-[#315124] dark:border-[#1d3916] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-serif text-3xl font-extrabold text-[#f6fbf0]">
              {userProfile.completedQuests.length}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#9bb78f] mt-1">
              Verified Missions
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-extrabold text-[#f6fbf0]">
              {userProfile.totalMinutesOutside}m
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#9bb78f] mt-1">
              Real Minutes Outside
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-extrabold text-[#f6fbf0]">
              {verifiedDiscoveriesCount}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#9bb78f] mt-1">
              Real Discoveries
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-extrabold text-[#f6fbf0]">
              {verifiedPlacesCount}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#9bb78f] mt-1">
              Recorded Places
            </div>
          </div>
        </div>
      </div>

      {/* THREE INTERACTIVE JOURNAL TABS */}
      {!isNewUser && (
        <div className="flex items-center gap-2 border-b border-[#dad1be] dark:border-[#243d1f] pb-2">
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'missions'
                ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] shadow-xs'
                : 'text-[#233f19] dark:text-[#97af92] hover:bg-[#ede5d3] dark:hover:bg-[#162714]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>EXPEDITIONS ({userProfile.completedQuests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discoveries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'discoveries'
                ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] shadow-xs'
                : 'text-[#233f19] dark:text-[#97af92] hover:bg-[#ede5d3] dark:hover:bg-[#162714]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>DISCOVERY LOG ({userProfile.discoveries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('curiosity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'curiosity'
                ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] shadow-xs'
                : 'text-[#233f19] dark:text-[#97af92] hover:bg-[#ede5d3] dark:hover:bg-[#162714]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURIOSITY CHAINS ({userProfile.curiosityChain.length})</span>
          </button>
        </div>
      )}

      {/* EMPTY PASSPORT HONEST STATE */}
      {isNewUser ? (
        <div className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#d9d0bc] dark:border-[#22391b] rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-sm field-card-deckle tech-card">
          <div className="w-16 h-16 rounded-2xl bg-[#efece1] dark:bg-[#172b15] border-2 border-dashed border-[#8bc34a] dark:border-[#4d7d3d] mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#51753e] dark:text-[#8bc34a]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#142312] dark:text-[#f4f7ee]">
              Your first page is still blank.
            </h3>
            <p className="text-xs sm:text-sm text-[#2b4124] dark:text-[#91a78b] leading-relaxed font-medium">
              Complete your first outdoor mission and leave your first mark. Each expedition you finish earns a field stamp, recording your observations, duration, and living discoveries.
            </p>
          </div>

          <button
            onClick={onStartQuest}
            className="px-6 py-3.5 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 tracking-wider btn-magnetic"
          >
            <Compass className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409]" />
            <span>START YOUR FIRST EXPEDITION</span>
          </button>
        </div>
      ) : activeTab === 'discoveries' ? (
        /* TAB 2: VERIFIED DISCOVERIES SPECIMEN GALLERY */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#142312] dark:text-[#f4f7ee]">
              Verified Naturalist Discoveries
            </h2>
            <span className="text-xs font-mono text-[#2b4124] dark:text-[#8ea287] font-semibold">
              SPECIMEN REPOSITORY
            </span>
          </div>

          {userProfile.discoveries.length === 0 ? (
            <div className="bg-[#faf8f2] dark:bg-[#111e10] p-8 rounded-3xl border border-[#dad1be] dark:border-[#22391b] text-center text-xs text-[#2b4124] dark:text-[#8ea287]">
              No standalone discoveries recorded yet. Click "+ Record Discovery" in Expedition Hub to log one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.discoveries.map((disc) => (
                <div
                  key={disc.id}
                  className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#d9d0bc] dark:border-[#22391b] rounded-3xl p-5 shadow-sm field-card-deckle space-y-3"
                >
                  {disc.photoUrl && (
                    <div className="w-full h-40 rounded-2xl overflow-hidden border border-[#d6cfba] dark:border-[#263e20]">
                      <img src={disc.photoUrl} alt={disc.text} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#233f19] dark:text-[#8bc34a] font-bold">
                      {disc.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-[#38512f] dark:text-[#8ea287] font-semibold">
                      {new Date(disc.recordedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="font-serif text-sm font-bold text-[#142312] dark:text-[#f4f7ee]">
                    "{disc.text}"
                  </p>

                  <div className="pt-2 border-t border-[#e5decb] dark:border-[#1e3419] flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#354f2c] dark:text-[#8ea287] font-bold">
                      {disc.environment.toUpperCase()}
                    </span>

                    {onTurnDiscoveryIntoQuest && (
                      <button
                        onClick={() => onTurnDiscoveryIntoQuest(disc)}
                        className="px-3 py-1.5 rounded-xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] text-[11px] font-bold flex items-center gap-1.5 btn-magnetic"
                      >
                        <Sparkles className="w-3 h-3 text-[#9be36e] dark:text-[#0b1409]" />
                        <span>TURN INTO QUEST</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'curiosity' ? (
        /* TAB 3: CURIOSITY CHAIN MAP */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#142312] dark:text-[#f4f7ee]">
              Curiosity Chains ({userProfile.curiosityChain.length})
            </h2>
            <span className="text-xs font-mono text-[#243e19] dark:text-[#8ea287] font-semibold">
              INQUIRY TRAILS
            </span>
          </div>

          {userProfile.curiosityChain.length === 0 ? (
            <div className="bg-[#faf8f2] dark:bg-[#111e10] p-8 rounded-3xl border border-[#dad1be] dark:border-[#22391b] text-center text-xs text-[#2b4124] dark:text-[#8ea287] font-medium">
              Answer "What caught your attention?" when completing your next quest to begin your curiosity chain!
            </div>
          ) : (
            <div className="space-y-4">
              {userProfile.curiosityChain.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#d9d0bc] dark:border-[#22391b] rounded-3xl p-6 shadow-sm field-card-deckle space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#e5decb] dark:border-[#1e3419] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#1e3914] text-white dark:bg-[#8bc34a] dark:text-[#0b1409] flex items-center justify-center font-bold text-xs font-mono">
                        #{userProfile.curiosityChain.length - idx}
                      </span>
                      <span className="text-xs font-serif font-bold text-[#142312] dark:text-[#f4f7ee]">
                        From: "{item.questTitle}"
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#38512f] dark:text-[#8ea287] font-semibold">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="bg-[#f2efe4] dark:bg-[#162714] p-3.5 rounded-2xl border border-[#ded5c2] dark:border-[#243d1f]">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#233f19] dark:text-[#8bc34a] block mb-1">
                        WHAT CAUGHT ATTENTION
                      </span>
                      <p className="text-xs text-[#142312] dark:text-[#d3e4cf] italic font-medium">
                        "{item.userObservation}"
                      </p>
                    </div>

                    <div className="bg-[#eaf3e1] dark:bg-[#132712] p-3.5 rounded-2xl border-2 border-[#9fc78c] dark:border-[#2a4d25]">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#1e3914] dark:text-[#8bc34a] block mb-1">
                        CURIOSITY QUESTION
                      </span>
                      <p className="font-serif text-sm font-bold text-[#142312] dark:text-[#f4f7ee]">
                        "{item.curiosityQuestion}"
                      </p>
                      <p className="text-[11px] text-[#2b4224] dark:text-[#9db795] mt-2 font-medium">
                        Next Mission Seed: <span className="font-semibold">{item.nextMissionSeed}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB 1: EXPEDITION REGISTRY CHRONOLOGICAL LOG */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#142312] dark:text-[#f4f7ee]">
              Expedition Registry ({userProfile.completedQuests.length})
            </h2>
            <span className="text-xs font-mono text-[#243e19] dark:text-[#8ea287] font-semibold">
              CHRONOLOGICAL FIELD LEDGER
            </span>
          </div>

          <div className="space-y-6">
            {userProfile.completedQuests.map((cq, idx) => {
              const dateStr = new Date(cq.completedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={cq.id}
                  className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#d9d0bc] dark:border-[#22391b] rounded-3xl p-6 sm:p-8 shadow-sm field-card-deckle space-y-4"
                >
                  {/* Card Header & Passport Stamp */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5decb] dark:border-[#1e3419] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1b2d18] dark:bg-[#1a3317] text-[#e8f5e0] flex items-center justify-center font-serif font-extrabold text-sm">
                        #{userProfile.completedQuests.length - idx}
                      </div>
                      <div>
                        <span className="text-xs font-serif font-bold text-[#142312] dark:text-[#f4f7ee]">
                          {dateStr}
                        </span>
                        <div className="text-[11px] font-mono uppercase text-[#2f4628] dark:text-[#8ea287] font-bold">
                          {cq.quest.environment.toUpperCase()} · {cq.durationCompletedMinutes} MIN OUTSIDE
                          {cq.verifiedPlaceName && ` · 📍 ${cq.verifiedPlaceName}`}
                        </div>
                      </div>
                    </div>

                    <div className="ink-stamp px-3 py-1 rounded bg-[#ecf5e4] dark:bg-[#183015] border border-[#7db058] dark:border-[#4d7d3d] text-[10px] font-mono font-bold text-[#1e3814] dark:text-[#a0db6f]">
                      FIELD VERIFIED
                    </div>
                  </div>

                  {/* Title & Mission */}
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#142312] dark:text-[#f4f7ee]">
                      {cq.quest.title}
                    </h3>
                    <p className="text-xs text-[#283e21] dark:text-[#91a78b] mt-1 italic font-medium">
                      "{cq.quest.mission}"
                    </p>
                  </div>

                  {/* Curiosity / Attention Observation if logged */}
                  {cq.curiosityObservation && (
                    <div className="bg-[#eef5e7] dark:bg-[#142713] p-4 rounded-2xl border-2 border-[#9fc78c] dark:border-[#274d22]">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1e3914] dark:text-[#8bc34a] block mb-1">
                        WHAT CAUGHT ATTENTION
                      </span>
                      <p className="font-serif text-sm text-[#142312] dark:text-[#e7ede4] leading-relaxed">
                        "{cq.curiosityObservation}"
                      </p>
                      {cq.curiosityQuestion && (
                        <p className="text-xs text-[#243e19] dark:text-[#9cd869] mt-2 font-bold">
                          Curiosity: "{cq.curiosityQuestion}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* User Field Notes */}
                  {cq.userNote && !cq.curiosityObservation && (
                    <div className="bg-[#f2efe4] dark:bg-[#162714] p-4 rounded-2xl border border-[#ded5c2] dark:border-[#253e20]">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#233f19] dark:text-[#8bc34a] block mb-1">
                        OBSERVATION NOTE
                      </span>
                      <p className="font-serif text-sm text-[#142312] dark:text-[#e7ede4] leading-relaxed">
                        "{cq.userNote}"
                      </p>
                    </div>
                  )}

                  {/* AI Naturalist Reflection if present */}
                  {cq.aiReflection && (
                    <div className="bg-[#eaf3e1] dark:bg-[#132712] p-4 rounded-2xl border-2 border-[#a5ca92] dark:border-[#2a4d25] space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1e3914] dark:text-[#8bc34a]">
                        <Sparkles className="w-3.5 h-3.5 text-[#1e3914] dark:text-[#8bc34a]" />
                        <span>NATURALIST REFLECTION</span>
                      </div>
                      <p className="text-xs text-[#142312] dark:text-[#cde4c4] leading-relaxed font-medium">
                        {cq.aiReflection}
                      </p>
                    </div>
                  )}

                  {/* Photos attached */}
                  {cq.photos && cq.photos.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#61745a] dark:text-[#8ea287] block mb-2">
                        FIELD SPECIMEN CAPTURES ({cq.photos.length})
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {cq.photos.map((src, pIdx) => (
                          <div key={pIdx} className="aspect-square rounded-2xl overflow-hidden border border-[#ded5c2] dark:border-[#253e20]">
                            <img src={src} alt={`Specimen capture ${pIdx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Danger Zone: Reset Data */}
      <div className="pt-6 border-t border-[#ded7c4] dark:border-[#21381b] flex items-center justify-between text-xs text-[#708469] dark:text-[#82997b]">
        <span>Strictly verified local storage. No fake gamification or telemetry.</span>
        {confirmReset ? (
          <div className="flex items-center gap-2">
            <span className="text-[#a03028] dark:text-[#e57373] font-semibold">Are you sure?</span>
            <button
              onClick={() => {
                onResetData();
                setConfirmReset(false);
              }}
              className="px-2.5 py-1 rounded bg-[#a03028] text-white font-medium hover:bg-[#83241d] transition-colors"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-2 py-1 rounded bg-[#ded7c4] dark:bg-[#1a2d18] text-[#1c2619] dark:text-[#f4f7ee] hover:bg-[#d0c7b0] transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1 hover:text-[#d32f2f] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Ledger</span>
          </button>
        )}
      </div>
    </div>
  );
};
