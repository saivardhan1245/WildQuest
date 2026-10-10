import React, { useState, useEffect } from 'react';
import { X, Cpu, CheckCircle2, AlertTriangle, RefreshCw, Terminal, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types/quest';
import { providerRegistry } from '../services/ai/providerRegistry';
import { ProviderHealth } from '../services/ai/types';

interface AIProviderModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProvider: (providerId: 'local-gemma' | 'offline-adaptive' | 'gemini-dev') => void;
}

export const AIProviderModal: React.FC<AIProviderModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onUpdateProvider
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'setup' | 'prompt'>('status');
  const [checking, setChecking] = useState<boolean>(false);
  const [providerHealths, setProviderHealths] = useState<Record<string, ProviderHealth>>({});
  const [copiedTerminal, setCopiedTerminal] = useState<boolean>(false);

  const checkAllProviders = async () => {
    setChecking(true);
    const providers = providerRegistry.getAllProviders();
    const results: Record<string, ProviderHealth> = {};

    for (const p of providers) {
      try {
        const health = await p.checkAvailability();
        results[p.id] = health;
      } catch (err: any) {
        results[p.id] = {
          available: false,
          isLocal: p.isLocal,
          message: err.message
        };
      }
    }

    setProviderHealths(results);
    setChecking(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkAllProviders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('ollama run gemma2:2b');
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2500);
  };

  const providers = providerRegistry.getAllProviders();

  return (
    <div className="fixed inset-0 z-50 bg-[#0d160c]/75 dark:bg-[#030603]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf8f2] dark:bg-[#111e10] border-2 border-[#dad2be] dark:border-[#284521] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-reveal">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5decb] dark:border-[#1e3419] pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#44662d] dark:text-[#8bc34a]">
              OPEN-WEIGHT AI ENGINE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#142312] dark:text-[#f4f7ee] mt-0.5">
              Gemma Intelligence Architecture
            </h2>
            <p className="text-xs text-[#52634a] dark:text-[#8ea287]">
              Inspect local inference, offline readiness, or developer fallbacks.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#60705a] dark:text-[#8ea287] hover:text-[#142312] dark:hover:text-[#f4f7ee] hover:bg-[#ede7d5] dark:hover:bg-[#1a2d18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 border-b border-[#e5decb] dark:border-[#1e3419] pt-4 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'status'
                ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409]'
                : 'text-[#4c5f46] dark:text-[#8ea287] hover:bg-[#ede7d5] dark:hover:bg-[#1a2d18]'
            }`}
          >
            Provider Status
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'setup'
                ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409]'
                : 'text-[#4c5f46] dark:text-[#8ea287] hover:bg-[#ede7d5] dark:hover:bg-[#1a2d18]'
            }`}
          >
            Local Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'prompt'
                ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409]'
                : 'text-[#4c5f46] dark:text-[#8ea287] hover:bg-[#ede7d5] dark:hover:bg-[#1a2d18]'
            }`}
          >
            System Prompt Inspection
          </button>
        </div>

        {/* TAB 1: STATUS */}
        {activeTab === 'status' && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#52634a] dark:text-[#8ea287]">SWAPPABLE PROVIDERS:</span>
              <button
                onClick={checkAllProviders}
                disabled={checking}
                className="flex items-center gap-1 text-[#355b23] dark:text-[#8bc34a] font-bold hover:underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                <span>Recheck Availability</span>
              </button>
            </div>

            <div className="space-y-3">
              {providers.map((p) => {
                const health = providerHealths[p.id];
                const isSelected = userProfile.activeProviderId === p.id;

                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[#385b28] dark:border-[#8bc34a] bg-[#f0ede0] dark:bg-[#162714]'
                        : 'border-[#ded5c2] dark:border-[#243d1f] bg-[#faf8f2] dark:bg-[#121f10]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">
                            {p.name}
                          </h4>
                          {p.isLocal && (
                            <span className="text-[9px] font-mono uppercase bg-[#e1ebd2] dark:bg-[#1a3317] text-[#2c471f] dark:text-[#a0db6f] px-1.5 py-0.5 rounded font-bold">
                              100% LOCAL
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#52634a] dark:text-[#8ea287] mt-0.5">
                          {p.description}
                        </p>
                      </div>

                      <button
                        onClick={() => onUpdateProvider(p.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#1b2d18] dark:bg-[#8bc34a] text-[#f7f5ed] dark:text-[#0b1409]'
                            : 'bg-[#ede7d5] dark:bg-[#1a2d18] text-[#33462d] dark:text-[#b4c9ad] hover:bg-[#ded7c4] dark:hover:bg-[#233c21]'
                        }`}
                      >
                        {isSelected ? 'ACTIVE' : 'SELECT'}
                      </button>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#e2d8c3] dark:border-[#1e3419] flex items-center justify-between text-[11px] font-mono">
                      <span>Status:</span>
                      <span className={health?.available ? 'text-[#355b23] dark:text-[#8bc34a] font-bold' : 'text-[#708468] dark:text-[#8ea287]'}>
                        {health ? (health.available ? 'Ready & Available' : (health.message || 'Standby')) : 'Checking...'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SETUP */}
        {activeTab === 'setup' && (
          <div className="mt-5 space-y-4 text-xs">
            <p className="text-[#3a4d33] dark:text-[#b4c9ad]">
              WildQuest runs Google's open-weight Gemma locally via Ollama. It requires zero cloud tokens and operates with total privacy.
            </p>

            <div className="bg-[#1b2d18] dark:bg-[#0c160b] text-[#e8f5e0] p-4 rounded-2xl font-mono space-y-2 border border-[#2f4f25] dark:border-[#213a19]">
              <div className="flex items-center justify-between text-[10px] text-[#8bc34a]">
                <span>TERMINAL COMMAND</span>
                <button
                  onClick={handleCopyCommand}
                  className="hover:underline flex items-center gap-1"
                >
                  <span>{copiedTerminal ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-sm font-bold text-[#f7f5ed]">
                ollama run gemma2:2b
              </div>
            </div>

            <ol className="list-decimal pl-5 space-y-1.5 text-[#4c5f46] dark:text-[#8ea287]">
              <li>Install Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#142312] dark:text-[#8bc34a]">ollama.com</a>.</li>
              <li>Open your terminal and execute <code className="bg-[#ede7d5] dark:bg-[#1a2d18] px-1 rounded">ollama run gemma2:2b</code>.</li>
              <li>WildQuest connects automatically via its internal endpoint.</li>
            </ol>
          </div>
        )}

        {/* TAB 3: SYSTEM PROMPT */}
        {activeTab === 'prompt' && (
          <div className="mt-5 space-y-3 text-xs">
            <span className="text-[10px] font-mono uppercase font-bold text-[#44662d] dark:text-[#8bc34a] block">
              GROUNDED GEMMA SYSTEM PROMPT
            </span>
            <div className="bg-[#f0ede1] dark:bg-[#162714] p-4 rounded-2xl border border-[#ded5c2] dark:border-[#243d1f] font-mono text-[11px] text-[#2c3d26] dark:text-[#d3e5cd] space-y-2 max-h-60 overflow-y-auto">
              <p>
                "You are the WildQuest Naturalist Guide. Your sole goal is getting humans to step away from screens and observe the living physical world."
              </p>
              <p>
                "Never encourage dangerous activity or destructive harvesting. Emphasize physical senses: hearing wind variations, examining leaf margins, spotting micro-habitats, and tactile bark patterns."
              </p>
              <p>
                "The user must lock their phone immediately upon viewing the mission."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
