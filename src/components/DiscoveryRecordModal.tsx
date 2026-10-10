import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, X, Compass, Leaf, Bug, Mountain, Droplets, Building2, Trees } from 'lucide-react';
import { DiscoveryRecord, DiscoveryCategory, QuestEnvironment, UserProfile } from '../types/quest';

interface DiscoveryRecordModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  initialText?: string;
  onClose: () => void;
  onSaveDiscovery: (discovery: DiscoveryRecord) => void;
  onTurnIntoQuest: (discovery: DiscoveryRecord) => void;
}

const CATEGORIES: { id: DiscoveryCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'flora', label: 'Flora & Leaves', icon: Leaf },
  { id: 'fauna', label: 'Fauna & Insects', icon: Bug },
  { id: 'fungi', label: 'Fungi & Lichen', icon: Trees },
  { id: 'geology', label: 'Geology & Soil', icon: Mountain },
  { id: 'water_weather', label: 'Water & Weather', icon: Droplets },
  { id: 'urban_nature', label: 'Urban Nature', icon: Building2 },
];

export const DiscoveryRecordModal: React.FC<DiscoveryRecordModalProps> = ({
  isOpen,
  userProfile,
  initialText = '',
  onClose,
  onSaveDiscovery,
  onTurnIntoQuest,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [category, setCategory] = useState<DiscoveryCategory>('flora');
  const [environment, setEnvironment] = useState<QuestEnvironment>('park');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [savedDiscovery, setSavedDiscovery] = useState<DiscoveryRecord | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoUrl(String(event.target.result));
      }
    };
    reader.readAsDataURL(file);
  };

  const buildDiscoveryObject = (): DiscoveryRecord => {
    const catObj = CATEGORIES.find((c) => c.id === category);
    return {
      id: `disc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: text.trim(),
      category,
      categoryLabel: catObj ? catObj.label : 'Natural Specimen',
      photoUrl: photoUrl || undefined,
      environment,
      recordedAt: new Date().toISOString(),
    };
  };

  const handleSaveOnly = () => {
    if (!text.trim()) return;
    const disc = buildDiscoveryObject();
    onSaveDiscovery(disc);
    onClose();
  };

  const handleTurnIntoQuest = () => {
    if (!text.trim()) return;
    const disc = buildDiscoveryObject();
    onSaveDiscovery(disc);
    onTurnIntoQuest(disc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#faf7ef] dark:bg-[#111e10] border-2 border-[#d6cbba] dark:border-[#27461e] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden field-card-deckle max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3d8c6] dark:border-[#1f371a] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#1b2d18] dark:bg-[#8bc34a] text-[#8bc34a] dark:text-[#0b1409] flex items-center justify-center">
              <Compass className="w-4 h-4 text-white dark:text-[#0b1409]" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#44662d] dark:text-[#8bc34a] block font-bold">
                FIELD SPECIMEN LOG
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#142312] dark:text-[#f4f7ee]">
                Record a Real Discovery
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#65765f] hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#ede5d3] dark:hover:bg-[#1a3016] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-5 space-y-5">
          {/* Text Description */}
          <div>
            <label className="text-xs font-serif font-bold text-[#142312] dark:text-[#f4f7ee] block mb-1.5">
              What did you find? <span className="text-[#a03028]">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. A cluster of tiny orange cup mushrooms growing out of a damp hemlock log..."
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-[#f2ede0] dark:bg-[#162714] border border-[#cfc3b0] dark:border-[#284420] text-sm text-[#142312] dark:text-[#f4f7ee] placeholder:text-[#384e31] dark:placeholder:text-[#8ea287] focus:outline-hidden focus:ring-2 focus:ring-[#1e3914] dark:focus:ring-[#8bc34a] resize-none font-medium"
            />
            <p className="text-[11px] text-[#2b4224] dark:text-[#8ea287] mt-1 font-medium">
              Be concrete. Your real observation directly shapes the next mission.
            </p>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-serif font-bold text-[#142312] dark:text-[#f4f7ee] block mb-2">
              Specimen Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                      isSelected
                        ? 'bg-[#1b2d18] text-[#f7f5ed] border-[#1b2d18] dark:bg-[#8bc34a] dark:text-[#0b1409] dark:border-[#8bc34a] shadow-xs'
                        : 'bg-[#f4efe3] dark:bg-[#162714] text-[#1c2e17] dark:text-[#d3e2cf] border-[#cfc3b0] dark:border-[#263e20] hover:bg-[#eae2cf]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Capture */}
          <div>
            <label className="text-xs font-serif font-bold text-[#142312] dark:text-[#f4f7ee] block mb-1.5">
              Field Specimen Photo (Optional)
            </label>
            {photoUrl ? (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#d6cbba] dark:border-[#284420]">
                <img src={photoUrl} alt="Captured specimen" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#b8ab96] dark:border-[#2b4822] rounded-2xl cursor-pointer bg-[#f4efe3] dark:bg-[#162714]/60 hover:bg-[#eae2cf] dark:hover:bg-[#1c3219] transition-colors">
                <Camera className="w-5 h-5 text-[#1e3914] dark:text-[#8bc34a] mb-1" />
                <span className="text-xs font-bold text-[#1e3914] dark:text-[#9bb295]">Attach or take a photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Environment */}
          <div>
            <label className="text-xs font-serif font-bold text-[#142312] dark:text-[#f4f7ee] block mb-1.5">
              Found In
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['park', 'neighborhood', 'garden', 'trail', 'anywhere'] as QuestEnvironment[]).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setEnvironment(env)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border uppercase tracking-wider transition-colors ${
                    environment === env
                      ? 'bg-[#1e3914] text-white border-[#1e3914] dark:bg-[#8bc34a] dark:text-[#0b1409]'
                      : 'bg-[#f4efe3] dark:bg-[#162714] text-[#24391f] dark:text-[#c4d4c1] border-[#cfc3b0] dark:border-[#263e20]'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 pt-4 border-t border-[#e3d8c6] dark:border-[#1f371a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={!text.trim()}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#ede5d3] hover:bg-[#ded4bf] dark:bg-[#1a3118] dark:hover:bg-[#234120] text-[#142312] dark:text-[#f4f7ee] text-xs font-bold transition-colors disabled:opacity-50"
          >
            SAVE TO PASSPORT LOG
          </button>

          <button
            type="button"
            onClick={handleTurnIntoQuest}
            disabled={!text.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 btn-magnetic"
          >
            <Sparkles className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409]" />
            <span>TURN THIS DISCOVERY INTO A QUEST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
