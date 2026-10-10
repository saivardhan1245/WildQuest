import React, { useState } from 'react';
import { Sparkles, Camera, Mic, MicOff, Check, Image as ImageIcon, X, MapPin, Compass, ArrowRight, HelpCircle } from 'lucide-react';
import { Quest, CompletedQuest, UserProfile, DiscoveryRecord } from '../types/quest';
import { providerRegistry } from '../services/ai/providerRegistry';

interface QuestReflectionModalProps {
  quest: Quest;
  durationMinutesSpent: number;
  userProfile: UserProfile;
  isOpen: boolean;
  onSave: (completedQuest: CompletedQuest, newDiscovery?: DiscoveryRecord) => void;
  onClose: () => void;
  onFollowCuriosity?: (curiosity: { observation: string; question: string; missionSeed: string }) => void;
}

export const QuestReflectionModal: React.FC<QuestReflectionModalProps> = ({
  quest,
  durationMinutesSpent,
  userProfile,
  isOpen,
  onSave,
  onClose,
  onFollowCuriosity
}) => {
  const [completionStatus, setCompletionStatus] = useState<'completed' | 'partial' | 'alternative_discovery'>('completed');
  const [userNote, setUserNote] = useState<string>('');
  const [attentionAnswer, setAttentionAnswer] = useState<string>('');
  const [verifiedPlace, setVerifiedPlace] = useState<string>('');
  const [difficultyFeedback, setDifficultyFeedback] = useState<'easier' | 'just_right' | 'harder' | 'different'>('just_right');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState<boolean>(false);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [curiositySpark, setCuriositySpark] = useState<{ curiosityQuestion: string; nextMissionSeed: string } | null>(null);
  const [saveAsDiscovery, setSaveAsDiscovery] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 3 - photos.length;
    const filesToLoad = Array.from(files).slice(0, remainingSlots);

    filesToLoad.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, String(event.target?.result)].slice(0, 3));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserNote((prev) => (prev ? `${prev} ${transcript}` : transcript));
            setIsRecordingVoice(false);
          };
          recognition.onerror = () => setIsRecordingVoice(false);
          recognition.onend = () => setIsRecordingVoice(false);
          recognition.start();
          return;
        } catch {
          // fallback
        }
      }
      setTimeout(() => {
        setIsRecordingVoice(false);
      }, 3000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  // Generate reflection and Curiosity Chain spark
  const handleRequestReflectionAndCuriosity = async () => {
    setIsGeneratingReflection(true);
    const observationText = attentionAnswer.trim() || userNote.trim() || 'Noticed subtle living details outdoors.';
    try {
      const activeProvider = providerRegistry.getProvider(userProfile.activeProviderId);
      
      // Parallel reflection and curiosity synthesis
      const [reflectionText, spark] = await Promise.all([
        activeProvider.generateReflection({
          quest,
          userNote: userNote || observationText,
          curiosityObservation: observationText,
          photoCount: photos.length,
          completionStatus,
          difficultyFeedback,
          userProfile
        }),
        providerRegistry.generateCuriositySparkWithFallback(
          userProfile.activeProviderId,
          observationText,
          quest
        )
      ]);

      setAiReflection(reflectionText);
      setCuriositySpark(spark);
    } catch {
      setAiReflection('Every minute spent looking at living systems leaves an impression. Your field passport ledger is stamped.');
      setCuriositySpark({
        curiosityQuestion: `What environmental factors explain why "${observationText.slice(0, 30)}" appeared in this exact spot?`,
        nextMissionSeed: 'Step outside and locate two adjacent micro-climates within 20 paces.'
      });
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  const handleFinalSave = () => {
    const completedRecord: CompletedQuest = {
      id: `cq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      quest,
      completedAt: new Date().toISOString(),
      durationCompletedMinutes: durationMinutesSpent,
      userNote: userNote.trim() || undefined,
      photos: photos,
      completionStatus,
      difficultyFeedback,
      aiReflection: aiReflection || 'Every minute spent looking at living systems leaves an impression. Your field passport ledger is stamped.',
      curiosityObservation: attentionAnswer.trim() || undefined,
      curiosityQuestion: curiositySpark?.curiosityQuestion,
      nextMissionSeed: curiositySpark?.nextMissionSeed,
      progressionStage: userProfile.currentProgressionStage,
      verifiedPlaceName: verifiedPlace.trim() || undefined,
    };

    let newDiscoveryRecord: DiscoveryRecord | undefined = undefined;
    if (saveAsDiscovery && (attentionAnswer.trim() || userNote.trim())) {
      newDiscoveryRecord = {
        id: `disc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        text: (attentionAnswer.trim() || userNote.trim()),
        category: 'flora',
        categoryLabel: quest.categoryLabel,
        photoUrl: photos[0],
        environment: quest.environment,
        recordedAt: new Date().toISOString(),
      };
    }

    onSave(completedRecord, newDiscoveryRecord);
  };

  const handleFollowCuriosityImmediately = () => {
    if (!curiositySpark) return;
    handleFinalSave();
    if (onFollowCuriosity) {
      onFollowCuriosity({
        observation: attentionAnswer.trim() || userNote.trim() || 'Living detail',
        question: curiositySpark.curiosityQuestion,
        missionSeed: curiositySpark.nextMissionSeed
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d160c]/80 dark:bg-[#030603]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#dad2be] dark:border-[#284521] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-reveal max-h-[92vh] overflow-y-auto field-card-deckle">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5decb] dark:border-[#1e3419] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#44662d] dark:text-[#8bc34a]">
                FIELD REFLECTION JOURNAL
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#e7edd8] dark:bg-[#1a3118] text-[#2c4b22] dark:text-[#a0db6f]">
                STAGE: {userProfile.currentProgressionStage.toUpperCase()}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#142312] dark:text-[#f4f7ee] mt-1">
              Welcome Back From The Trail
            </h2>
            <p className="text-xs text-[#52634a] dark:text-[#8ea287]">
              {durationMinutesSpent} verified minutes outdoors in the physical world.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#60705a] dark:text-[#8ea287] hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#ede7d5] dark:hover:bg-[#1a2d18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Mission summary */}
          <div className="bg-[#f0ede1] dark:bg-[#162714] p-4 rounded-2xl border border-[#dad1be] dark:border-[#243d1f]">
            <span className="text-[10px] uppercase font-bold text-[#6a7c64] dark:text-[#8ea287] block">
              COMPLETED MISSION
            </span>
            <h3 className="font-serif font-bold text-base text-[#142312] dark:text-[#f4f7ee] mt-0.5">
              {quest.title}
            </h3>
            <p className="text-xs text-[#52634a] dark:text-[#a1b79c] mt-1 italic">
              "{quest.mission}"
            </p>
          </div>

          {/* SIGNATURE FEATURE 2: CURIOSITY CHAIN ("What caught your attention?") */}
          <div className="bg-[#eef5e7] dark:bg-[#142613] p-5 rounded-2xl border-2 border-[#9fc78c] dark:border-[#2b5124] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#1e3914] text-white dark:bg-[#8bc34a] dark:text-[#0b1409] flex items-center justify-center font-bold text-xs">
                ?
              </span>
              <div>
                <label className="text-xs font-serif font-extrabold text-[#142312] dark:text-[#f4f7ee] block">
                  What caught your attention?
                </label>
                <span className="text-[10px] font-mono text-[#233f19] dark:text-[#9fc794] font-bold">
                  CURIOSITY CHAIN SEED
                </span>
              </div>
            </div>

            <textarea
              value={attentionAnswer}
              onChange={(e) => setAttentionAnswer(e.target.value)}
              rows={2}
              placeholder="e.g. A trail of ants carrying leaves into a sidewalk crack... / How the moss only grew on the shaded side of the birch..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f1c0e] border-2 border-[#a5ca92] dark:border-[#2a4d25] text-xs text-[#142312] dark:text-[#f4f7ee] placeholder:text-[#384e31] dark:placeholder:text-[#8ea287] focus:outline-hidden focus:ring-2 focus:ring-[#1e3914] resize-none font-medium"
            />

            <p className="text-[11px] text-[#243d1b] dark:text-[#9db795] leading-relaxed font-medium">
              Your answer generates a natural inquiry question for your next expedition story.
            </p>

            {/* Synthesized Curiosity Card */}
            {curiositySpark && (
              <div className="mt-3 p-4 rounded-xl bg-white dark:bg-[#0c170b] border-2 border-[#82b86b] dark:border-[#2c5324] space-y-2 shadow-xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#1b3912] dark:text-[#8bc34a]">
                  <Sparkles className="w-3.5 h-3.5 text-[#2e591f] dark:text-[#8bc34a]" />
                  <span>EMERGENT CURIOSITY SPARK</span>
                </div>
                <h4 className="font-serif text-sm font-extrabold text-[#142312] dark:text-[#f4f7ee]">
                  "{curiositySpark.curiosityQuestion}"
                </h4>
                <p className="text-xs text-[#284121] dark:text-[#a0b69a] italic font-medium">
                  Suggested Next Mission: "{curiositySpark.nextMissionSeed}"
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleFollowCuriosityImmediately}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1b2d18] hover:bg-[#122110] text-white dark:bg-[#8bc34a] dark:text-[#0b1409] text-xs font-bold transition-colors flex items-center gap-1.5 btn-magnetic"
                  >
                    <span>FOLLOW THIS CURIOSITY → PLAN NEXT QUEST</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9ce06a] dark:text-[#0b1409]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIGNATURE FEATURE 1: ADAPTIVE QUEST EVOLUTION (Difficulty Feedback) */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-1.5">
              ADAPTIVE PROGRESSION: HOW WAS THIS MISSION FOR YOU?
            </label>
            <p className="text-[11px] text-[#344d2d] dark:text-[#8ea287] mb-2 font-medium">
              Your real feedback guides the evolution: observe → learn → explore deeper.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'easier', label: 'Felt Too Hard', desc: 'Need simpler focus' },
                { id: 'just_right', label: 'Just Right', desc: 'Paced naturally' },
                { id: 'harder', label: 'Too Simple', desc: 'Deepen the challenge' },
                { id: 'different', label: 'Different Theme', desc: 'Pivot category' },
              ].map((df) => (
                <button
                  key={df.id}
                  type="button"
                  onClick={() => setDifficultyFeedback(df.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    difficultyFeedback === df.id
                      ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] border-[#1b2d18] dark:border-[#8bc34a] shadow-xs'
                      : 'bg-[#f4efe2] dark:bg-[#162714] text-[#1c2e17] dark:text-[#b4c9ad] border-[#ded5c2] dark:border-[#243d1f] hover:bg-[#ede6d4]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#142312] dark:text-[#f4f7ee]">{df.label}</div>
                  <div className="text-[10px] text-[#354f2d] dark:text-[#9bb593] font-medium mt-0.5">{df.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Outcome Status */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-2">
              MISSION EXECUTION
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCompletionStatus('completed')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                  completionStatus === 'completed'
                    ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] border-[#1b2d18] dark:border-[#8bc34a]'
                    : 'bg-[#f4efe2] dark:bg-[#162714] text-[#1c2e17] dark:text-[#b4c9ad] border-[#ded5c2] dark:border-[#243d1f]'
                }`}
              >
                <div>✓ Completed</div>
                <div className="text-[10px] font-medium text-[#38522f] dark:text-[#9bb593] mt-0.5">Found target observations</div>
              </button>

              <button
                type="button"
                onClick={() => setCompletionStatus('partial')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                  completionStatus === 'partial'
                    ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] border-[#1b2d18] dark:border-[#8bc34a]'
                    : 'bg-[#f4efe2] dark:bg-[#162714] text-[#1c2e17] dark:text-[#b4c9ad] border-[#ded5c2] dark:border-[#243d1f]'
                }`}
              >
                <div>Partial Expedition</div>
                <div className="text-[10px] font-medium text-[#38522f] dark:text-[#9bb593] mt-0.5">Walked & saw a few things</div>
              </button>

              <button
                type="button"
                onClick={() => setCompletionStatus('alternative_discovery')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                  completionStatus === 'alternative_discovery'
                    ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409] border-[#1b2d18] dark:border-[#8bc34a]'
                    : 'bg-[#f4efe2] dark:bg-[#162714] text-[#1c2e17] dark:text-[#b4c9ad] border-[#ded5c2] dark:border-[#243d1f]'
                }`}
              >
                <div>Alternative Path</div>
                <div className="text-[10px] font-medium text-[#38522f] dark:text-[#9bb593] mt-0.5">Found something unexpected</div>
              </button>
            </div>
          </div>

          {/* User Field Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee]">
                ADDITIONAL FIELD NOTES (OPTIONAL)
              </label>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  isRecordingVoice
                    ? 'bg-[#e66b27] text-white border-[#e66b27] animate-pulse'
                    : 'bg-[#f4efe2] dark:bg-[#162714] text-[#1e3914] dark:text-[#8bc34a] border-[#ded5c2] dark:border-[#243d1f]'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>{isRecordingVoice ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            </div>
            <textarea
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              rows={2}
              placeholder="Sensory impressions, weather feel, light shifts..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#f4efe2] dark:bg-[#162714] border border-[#ded5c2] dark:border-[#243d1f] text-xs text-[#142312] dark:text-[#f4f7ee] placeholder:text-[#384e31] dark:placeholder:text-[#8ea287] focus:outline-hidden font-medium"
            />
          </div>

          {/* SIGNATURE FEATURE 5: Real-World Passport Verified Location (Explicit User Consent Only) */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-1">
              RECORD LOCATION IN PASSPORT (OPTIONAL)
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1e3914] dark:text-[#8bc34a]" />
              <input
                type="text"
                value={verifiedPlace}
                onChange={(e) => setVerifiedPlace(e.target.value)}
                placeholder="e.g. Maple Creek Park, West Campus Quad (Only saved if you type it)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#f4efe2] dark:bg-[#162714] border border-[#ded5c2] dark:border-[#243d1f] text-xs text-[#142312] dark:text-[#f4f7ee] placeholder:text-[#384e31] dark:placeholder:text-[#8ea287] font-medium"
              />
            </div>
            <p className="text-[10px] text-[#344b2d] dark:text-[#8da487] mt-1 font-medium">
              Zero GPS tracking. Locations exist in your passport only if you explicitly record them.
            </p>
          </div>

          {/* Photos Upload (Local only) */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#142312] dark:text-[#f4f7ee] mb-1.5">
              PHOTO SPECIMENS (MAX 3 · LOCAL ON-DEVICE ONLY)
            </label>
            <div className="flex items-center gap-3">
              {photos.map((src, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#ded5c2] dark:border-[#243d1f]">
                  <img src={src} alt="Upload" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {photos.length < 3 && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#ded5c2] dark:border-[#243d1f] flex flex-col items-center justify-center cursor-pointer hover:bg-[#ede7d5] dark:hover:bg-[#162714] text-[#344d2d] dark:text-[#8ea287]">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] font-mono font-bold">ADD</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Save Note as Discovery Checkbox */}
          {(attentionAnswer.trim() || userNote.trim()) && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="saveDiscoveryCheck"
                checked={saveAsDiscovery}
                onChange={(e) => setSaveAsDiscovery(e.target.checked)}
                className="w-4 h-4 rounded text-[#1b2d18] focus:ring-[#1b2d18]"
              />
              <label htmlFor="saveDiscoveryCheck" className="text-xs font-semibold text-[#142312] dark:text-[#cde0cb]">
                Also log this observation as an official specimen discovery in my journal.
              </label>
            </div>
          )}

          {/* AI Naturalist Synthesis & Curiosity Trigger */}
          <div className="pt-2 border-t border-[#e5decb] dark:border-[#1e3419]">
            {!aiReflection ? (
              <button
                type="button"
                onClick={handleRequestReflectionAndCuriosity}
                disabled={isGeneratingReflection}
                className="w-full py-3 rounded-2xl bg-[#1e3914] hover:bg-[#14290e] dark:bg-[#162914] text-[#f7f5ed] dark:text-[#a0db6f] border border-[#2b4c1f] dark:border-[#2c4824] text-xs font-bold transition-all flex items-center justify-center gap-2 btn-magnetic shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#9be36e]" />
                <span>
                  {isGeneratingReflection
                    ? 'Synthesizing Ecological Reflection & Curiosity...'
                    : 'Synthesize Naturalist Insight & Curiosity Spark'}
                </span>
              </button>
            ) : (
              <div className="bg-[#eaf3e1] dark:bg-[#132712] p-4 rounded-2xl border-2 border-[#a5ca92] dark:border-[#2a4d25] space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1e3914] dark:text-[#8bc34a]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1e3914] dark:text-[#8bc34a]" />
                  <span>NATURALIST NOTE</span>
                </div>
                <p className="text-xs text-[#142312] dark:text-[#cde4c4] leading-relaxed font-medium">
                  {aiReflection}
                </p>
              </div>
            )}
          </div>

          {/* Final Stamp & Save CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleFinalSave}
              className="w-full py-4 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-sm shadow-md transition-all tracking-wider btn-magnetic"
            >
              STAMP IN FIELD PASSPORT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
