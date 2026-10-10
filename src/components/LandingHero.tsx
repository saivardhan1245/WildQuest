import React, { useState } from 'react';
import { Compass, ArrowRight, Trees, Smartphone, EyeOff, Sparkles, Lock, Wifi, RefreshCw, DollarSign, Leaf, Cpu } from 'lucide-react';

interface LandingHeroProps {
  onStartQuest: () => void;
  onOpenHowItWorks: () => void;
  onOpenAIModal: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartQuest,
  onOpenHowItWorks,
  onOpenAIModal
}) => {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div className="space-y-24">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 rounded-3xl border border-[#ded7c4] dark:border-[#243a1f] bg-radial from-[#ffffff] via-[#f7f4ea] to-[#ede7d4] dark:from-[#112010] dark:via-[#0c160a] dark:to-[#070d06] shadow-sm topo-grid animate-reveal">
        {/* Ambient natural light & floating decorative elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8bc34a]/15 dark:bg-[#8bc34a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-[#e66b27]/10 dark:bg-[#e66b27]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Floating leaves SVG decorations */}
        <div className="absolute top-12 left-10 text-[#4c753b]/30 dark:text-[#8bc34a]/20 animate-float pointer-events-none hidden md:block">
          <Leaf className="w-8 h-8" />
        </div>
        <div className="absolute bottom-16 right-12 text-[#e66b27]/30 dark:text-[#e66b27]/20 animate-float-reverse pointer-events-none hidden md:block">
          <Leaf className="w-6 h-6 rotate-45" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          {/* Large Editorial Title */}
          <div className="space-y-3">
            <p className="font-serif uppercase tracking-[0.25em] text-xs sm:text-sm font-bold text-[#44662d] dark:text-[#8bc34a]">
              WILDQUEST
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#142312] dark:text-[#f4f7ee] leading-[1.06]">
              AI that gives you a reason <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#2b4c1f] dark:text-[#9cd869]">to go outside.</span>
            </h1>
          </div>

          {/* Secondary Subheading */}
          <p className="mt-6 text-xl sm:text-2xl text-[#2b4c1f] dark:text-[#a0db6f] max-w-2xl mx-auto font-serif italic font-semibold leading-relaxed">
            "AI gives you the question. <br />
            The real world gives you the answer."
          </p>

          <p className="mt-3 text-xs sm:text-sm text-[#66775f] dark:text-[#82997b] max-w-xl mx-auto">
            Small physical-world missions synthesized by open-weight Gemma that deliberately get you off the screen.
          </p>

          {/* Interactive Hero CTAs with microinteraction */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Action Button with Hover Expansion */}
            <button
              onClick={onStartQuest}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              className="relative w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7db43f] text-[#f7f5ed] dark:text-[#0b1409] font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center group overflow-hidden btn-magnetic"
            >
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-0.5">
                <span className="tracking-wider">START A QUEST</span>
                <ArrowRight className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409] group-hover:translate-x-1.5 transition-transform" />
              </div>
              
              {/* Microinteraction subtext */}
              <span
                className={`text-[10px] text-[#9ac87c] dark:text-[#183012] font-semibold tracking-wider uppercase transition-all duration-300 ${
                  btnHovered ? 'max-h-5 opacity-100 mt-1' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                30 MINUTES · ONE MISSION · ZERO SCROLLING
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onOpenHowItWorks}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#faf8f2] hover:bg-[#ede7d5] dark:bg-[#152414] dark:hover:bg-[#1e341c] text-[#2c3d26] dark:text-[#e4ede0] font-semibold text-xs border border-[#dad2bd] dark:border-[#294222] shadow-2xs hover:shadow-xs transition-all tracking-wider btn-magnetic"
            >
              EXPLORE HOW IT WORKS
            </button>
          </div>

          {/* Anti-Screen Guarantee Pill */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-[#52634a] dark:text-[#a0b698] bg-[#ebe6d5]/70 dark:bg-[#162713]/70 px-4 py-2 rounded-full border border-[#ded7c4] dark:border-[#294121]">
            <EyeOff className="w-3.5 h-3.5 text-[#3d6132] dark:text-[#8bc34a]" />
            <span>The screen is the <strong>shortest</strong> part of your journey.</span>
          </div>

          {/* EXAMPLE MISSION CARD (PREVIEW ONLY - DOES NOT AFFECT USER STATS) */}
          <div className="mt-12 max-w-lg mx-auto text-left tech-card">
            <div className="bg-[#faf7ef] dark:bg-[#132211] border-2 border-[#d5ccb7] dark:border-[#2a4522] rounded-3xl p-6 sm:p-7 shadow-lg field-card-deckle relative overflow-hidden">
              {/* Preview badge */}
              <div className="flex items-center justify-between border-b border-[#e3dacf] dark:border-[#21351b] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#e66b27] text-white px-2 py-0.5 rounded">
                    EXAMPLE MISSION
                  </span>
                  <span className="text-[10px] font-mono text-[#6c7f66] dark:text-[#8ea286] uppercase">
                    Preview only · No stats affected
                  </span>
                </div>
                <span className="text-xs font-serif font-bold text-[#44662d] dark:text-[#8bc34a]">30 MIN · BEGINNER · PARK</span>
              </div>

              {/* Title */}
              <h3 className="font-serif font-extrabold text-xl text-[#142312] dark:text-[#f4f7ee] flex items-center gap-2">
                <span>🌿 THE 30-MINUTE MICRO-SAFARI</span>
              </h3>

              {/* Checklist */}
              <div className="mt-4 space-y-2 text-xs text-[#1e2d19] dark:text-[#dbe6d6]">
                <div className="flex items-start gap-2 bg-[#f2efe4] dark:bg-[#1a2c17] p-2.5 rounded-xl border border-[#e2dac9] dark:border-[#2c4424]">
                  <span className="text-[#3d6132] dark:text-[#8bc34a] font-bold">•</span>
                  <span>Find 3 different leaf shapes.</span>
                </div>
                <div className="flex items-start gap-2 bg-[#f2efe4] dark:bg-[#1a2c17] p-2.5 rounded-xl border border-[#e2dac9] dark:border-[#2c4424]">
                  <span className="text-[#3d6132] dark:text-[#8bc34a] font-bold">•</span>
                  <span>Spot one living thing you normally ignore.</span>
                </div>
                <div className="flex items-start gap-2 bg-[#f2efe4] dark:bg-[#1a2c17] p-2.5 rounded-xl border border-[#e2dac9] dark:border-[#2c4424]">
                  <span className="text-[#3d6132] dark:text-[#8bc34a] font-bold">•</span>
                  <span>Find one sign of how humans interact with nature.</span>
                </div>
              </div>

              {/* Bold Footer */}
              <div className="mt-5 bg-[#1b2d18] dark:bg-[#0c160b] border border-transparent dark:border-[#253f1f] text-[#f7f5ed] p-3 rounded-xl text-center">
                <span className="font-serif font-extrabold text-xs tracking-wider uppercase text-[#9be46f] dark:text-[#a1e874]">
                  "NOW PUT YOUR PHONE AWAY."
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOT ANOTHER AI CHATBOT SECTION */}
      <section className="bg-[#f0ede0] dark:bg-[#111e10] rounded-3xl border-2 border-[#dad2be] dark:border-[#243c1e] p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-4 shadow-sm tech-card">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#44662d] dark:text-[#8bc34a]">
          RADICAL FOCUS
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#142312] dark:text-[#f4f7ee] tracking-tight">
          NOT ANOTHER AI CHATBOT.
        </h2>
        <p className="font-serif italic text-lg sm:text-2xl text-[#2a3f23] dark:text-[#b4c9ad] max-w-2xl mx-auto leading-relaxed">
          "WildQuest doesn't want another 30 minutes of your attention.<br className="hidden sm:inline" />
          It wants the next 30 minutes of your life."
        </p>
      </section>

      {/* 3. CORE PRODUCT STATEMENT (Huge Visual Impact Section) */}
      <section className="bg-[#1b2d18] dark:bg-[#0d180c] text-[#f6f3e9] rounded-3xl p-8 sm:p-16 border border-[#2d4726] dark:border-[#21381b] shadow-xl relative overflow-hidden forest-canopy-bg tech-card">
        {/* Subtle organic light gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4d7c38]/20 dark:bg-[#8bc34a]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#274021] dark:bg-[#182c16] text-[#cbe5b2] text-[11px] font-bold uppercase tracking-widest">
            <EyeOff className="w-3.5 h-3.5 text-[#8bc34a]" />
            <span>Product Manifesto</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-[#f7f5ed]">
            THE BEST INTERACTION <br />
            WITH WILDQUEST <br />
            <span className="text-[#8bc34a] underline decoration-[#e66b27] decoration-4">IS CLOSING IT.</span>
          </h2>

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-[#d0ded0] leading-relaxed border-t border-[#2d4726] dark:border-[#21371b]">
            <div>
              <p className="font-serif text-xl sm:text-2xl text-[#f3f9ed] font-bold mb-2">
                "Most AI products compete for your attention."
              </p>
              <p className="text-xs sm:text-sm text-[#b6cbb0]">
                Infinite feeds, conversational entrapment, and notification dopamine traps designed to maximize screen time.
              </p>
            </div>

            <div>
              <p className="font-serif text-xl sm:text-2xl text-[#8bc34a] font-bold mb-2">
                "WildQuest uses AI to give your attention back."
              </p>
              <p className="text-xs sm:text-sm text-[#b6cbb0]">
                We measure product success not by minutes spent tapping glass, but by how quickly you lock your device and step into the sunlight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4-STEP HORIZONTAL ADVENTURE JOURNEY */}
      <section id="how-it-works-anchor" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#44662d] dark:text-[#8bc34a]">Expedition Flow</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#142312] dark:text-[#f4f7ee]">
            The 4-Step Outdoor Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#5a6a52] dark:text-[#8ea287]">
            From screen to soil in thirty seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 01 */}
          <div className="bg-[#faf8f2] dark:bg-[#121f10] border-2 border-[#dcd4c0] dark:border-[#22381b] rounded-3xl p-6 flex flex-col justify-between shadow-2xs hover:border-[#8bc34a] transition-all group field-card-deckle">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif font-extrabold text-2xl text-[#1b2d18] dark:text-[#8bc34a]">01</span>
                <div className="w-8 h-8 rounded-xl bg-[#e5f0d8] dark:bg-[#1e3419] text-[#243f1d] dark:text-[#a0db6f] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142312] dark:text-[#f4f7ee]">
                GET YOUR MISSION
              </h3>
              <p className="text-xs text-[#52634a] dark:text-[#96ab8f] mt-2 leading-relaxed">
                Gemma creates one concrete outdoor challenge based on your time, environment, and experience.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#ede7d5] dark:border-[#1c2e17] text-[11px] font-semibold text-[#44662d] dark:text-[#8bc34a]">
              ~15 seconds on screen
            </div>
          </div>

          {/* Step 02 */}
          <div className="bg-[#faf8f2] dark:bg-[#121f10] border-2 border-[#dcd4c0] dark:border-[#22381b] rounded-3xl p-6 flex flex-col justify-between shadow-2xs hover:border-[#8bc34a] transition-all group field-card-deckle">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif font-extrabold text-2xl text-[#1b2d18] dark:text-[#8bc34a]">02</span>
                <div className="w-8 h-8 rounded-xl bg-[#e5f0d8] dark:bg-[#1e3419] text-[#243f1d] dark:text-[#a0db6f] flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142312] dark:text-[#f4f7ee]">
                POCKET YOUR PHONE
              </h3>
              <p className="text-xs text-[#52634a] dark:text-[#96ab8f] mt-2 leading-relaxed">
                Seriously. Put it away. Outdoor Mode strips away feeds and notifications. Lock your screen.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#ede7d5] dark:border-[#1c2e17] text-[11px] font-semibold text-[#44662d] dark:text-[#8bc34a]">
              Screen locked & dark
            </div>
          </div>

          {/* Step 03 */}
          <div className="bg-[#faf8f2] dark:bg-[#121f10] border-2 border-[#dcd4c0] dark:border-[#22381b] rounded-3xl p-6 flex flex-col justify-between shadow-2xs hover:border-[#8bc34a] transition-all group field-card-deckle">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif font-extrabold text-2xl text-[#1b2d18] dark:text-[#8bc34a]">03</span>
                <div className="w-8 h-8 rounded-xl bg-[#e5f0d8] dark:bg-[#1e3419] text-[#243f1d] dark:text-[#a0db6f] flex items-center justify-center font-bold">
                  <Trees className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142312] dark:text-[#f4f7ee]">
                TOUCH GRASS
              </h3>
              <p className="text-xs text-[#52634a] dark:text-[#96ab8f] mt-2 leading-relaxed">
                20–60 minutes. The real physical world is now the interface. Listen for the harmonic audio chime.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#ede7d5] dark:border-[#1c2e17] text-[11px] font-semibold text-[#44662d] dark:text-[#8bc34a]">
              Direct sensory presence
            </div>
          </div>

          {/* Step 04 */}
          <div className="bg-[#faf8f2] dark:bg-[#121f10] border-2 border-[#dcd4c0] dark:border-[#22381b] rounded-3xl p-6 flex flex-col justify-between shadow-2xs hover:border-[#8bc34a] transition-all group field-card-deckle">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif font-extrabold text-2xl text-[#1b2d18] dark:text-[#8bc34a]">04</span>
                <div className="w-8 h-8 rounded-xl bg-[#e5f0d8] dark:bg-[#1e3419] text-[#243f1d] dark:text-[#a0db6f] flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142312] dark:text-[#f4f7ee]">
                COME BACK WITH A STORY
              </h3>
              <p className="text-xs text-[#52634a] dark:text-[#96ab8f] mt-2 leading-relaxed">
                Reflect. Record what surprised you. Gemma offers a short reflection and adapts tomorrow's curiosity seed.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#ede7d5] dark:border-[#1c2e17] text-[11px] font-semibold text-[#44662d] dark:text-[#8bc34a]">
              Field Passport stamped
            </div>
          </div>
        </div>
      </section>

      {/* 5. GEMMA / OPEN AI ARCHITECTURE SECTION */}
      <section id="open-ai-anchor" className="bg-[#faf8f2] dark:bg-[#111e10] rounded-3xl border-2 border-[#dad2be] dark:border-[#243c1e] p-6 sm:p-12 space-y-10 field-card-deckle tech-card">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3d6132] dark:text-[#8bc34a]">
              <Cpu className="w-4 h-4" />
              <span>Open-Weight AI Foundation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#142312] dark:text-[#f4f7ee]">
              AI That Doesn't Need To Own Your Data.
            </h2>
            <p className="text-xs sm:text-sm text-[#5a6a52] dark:text-[#91a78b] max-w-xl">
              Powered by Google’s open-weight Gemma 2 model running locally. No closed corporate silos, no location tracking.
            </p>
          </div>

          <button
            onClick={onOpenAIModal}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-[#1b2d18] dark:bg-[#1e341a] text-[#f6f3e9] dark:text-[#f4f7ee] border border-transparent dark:border-[#38582f] font-bold text-xs hover:bg-[#122110] dark:hover:bg-[#284623] transition-colors flex items-center gap-2 btn-magnetic"
          >
            <Cpu className="w-3.5 h-3.5 text-[#8bc34a]" />
            <span>Inspect Gemma Architecture</span>
          </button>
        </div>

        {/* Visual Architecture Flow: YOUR DEVICE → GEMMA → QUEST → REAL WORLD */}
        <div className="bg-[#f0ede0] dark:bg-[#0d170c] rounded-2xl p-6 sm:p-8 border border-[#ded7c4] dark:border-[#1e3318]">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase font-bold text-[#44662d] dark:text-[#8bc34a] tracking-wider">
              YOUR DEVICE → GEMMA → QUEST → REAL WORLD
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
            {/* Box 1 */}
            <div className="w-full md:w-48 p-4 rounded-xl bg-[#faf8f2] dark:bg-[#142312] border border-[#d6ceba] dark:border-[#284122] shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-[#6a7c62] dark:text-[#8ea287] mb-1">01 Local</div>
              <div className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">YOUR DEVICE</div>
              <div className="text-[10px] text-[#55694c] dark:text-[#82997b] mt-0.5">Zero GPS leaves device</div>
            </div>

            <div className="text-[#3d6132] dark:text-[#8bc34a] font-bold text-base rotate-90 md:rotate-0">
              →
            </div>

            {/* Box 2 */}
            <div className="w-full md:w-52 p-4 rounded-xl bg-[#1b2d18] dark:bg-[#1b3417] text-[#f6f3e9] border border-[#305027] dark:border-[#385e2e] shadow-xs">
              <div className="text-[10px] uppercase font-bold text-[#8bc34a] mb-1">02 Open AI</div>
              <div className="font-serif font-bold text-base text-[#f7f5ed]">GEMMA 2</div>
              <div className="text-[10px] text-[#b6cbb0] mt-0.5">Local Open-Weight Model</div>
            </div>

            <div className="text-[#3d6132] dark:text-[#8bc34a] font-bold text-base rotate-90 md:rotate-0">
              →
            </div>

            {/* Box 3 */}
            <div className="w-full md:w-48 p-4 rounded-xl bg-[#faf8f2] dark:bg-[#142312] border border-[#d6ceba] dark:border-[#284122] shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-[#6a7c62] dark:text-[#8ea287] mb-1">03 Output</div>
              <div className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">QUEST CARD</div>
              <div className="text-[10px] text-[#55694c] dark:text-[#82997b] mt-0.5">Physical checklist</div>
            </div>

            <div className="text-[#3d6132] dark:text-[#8bc34a] font-bold text-base rotate-90 md:rotate-0">
              →
            </div>

            {/* Box 4 */}
            <div className="w-full md:w-48 p-4 rounded-xl bg-[#e3eed4] dark:bg-[#1b3618] border border-[#bad4a0] dark:border-[#2f5529] shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-[#44662d] dark:text-[#8bc34a] mb-1">04 Physical</div>
              <div className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">REAL WORLD</div>
              <div className="text-[10px] text-[#44662d] dark:text-[#a0db6f] mt-0.5">Touch Grass Outdoors</div>
            </div>
          </div>
        </div>

        {/* 4 Visual Pillars of Why Open AI Matters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="bg-[#f0ede0] dark:bg-[#0d170c] p-5 rounded-2xl border border-[#ded7c4] dark:border-[#1e3318] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#e2edd4] dark:bg-[#1a3117] text-[#1b2d18] flex items-center justify-center font-bold">
              <Lock className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">PRIVACY-FIRST</h4>
            <p className="text-xs text-[#52634a] dark:text-[#91a78b] leading-relaxed">
              Observations, field notes, and surroundings remain stored strictly on your local browser.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#f0ede0] dark:bg-[#0d170c] p-5 rounded-2xl border border-[#ded7c4] dark:border-[#1e3318] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#e2edd4] dark:bg-[#1a3117] text-[#1b2d18] flex items-center justify-center font-bold">
              <Wifi className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">OFFLINE-READY</h4>
            <p className="text-xs text-[#52634a] dark:text-[#91a78b] leading-relaxed">
              On-device heuristic engine and PWA service worker shell function on remote trails without internet.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#f0ede0] dark:bg-[#0d170c] p-5 rounded-2xl border border-[#ded7c4] dark:border-[#1e3318] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#e2edd4] dark:bg-[#1a3117] text-[#1b2d18] flex items-center justify-center font-bold">
              <RefreshCw className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">MODEL FREEDOM</h4>
            <p className="text-xs text-[#52634a] dark:text-[#91a78b] leading-relaxed">
              Swap Gemma 2 for other open-weight models seamlessly with our swappable AIProvider interface.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#f0ede0] dark:bg-[#0d170c] p-5 rounded-2xl border border-[#ded7c4] dark:border-[#1e3318] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#e2edd4] dark:bg-[#1a3117] text-[#1b2d18] flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4 text-[#3d6132] dark:text-[#8bc34a]" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#142312] dark:text-[#f4f7ee]">OPEN-WEIGHT AI</h4>
            <p className="text-xs text-[#52634a] dark:text-[#91a78b] leading-relaxed">
              Google’s open-weight Gemma 2 model eliminates recurring per-token cloud API costs.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="text-center py-10 space-y-5 border-t-2 border-[#ded7c4] dark:border-[#21381b]">
        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#142312] dark:text-[#f4f7ee] tracking-tight">
            "Close the app. <br className="sm:hidden" />Touch grass. <br className="sm:hidden" />Come back with a story."
          </h2>
          <p className="text-xs sm:text-sm text-[#5a6a52] dark:text-[#91a78b] max-w-md mx-auto">
            Your tailored outdoor mission is waiting. Ready in 20 seconds.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onStartQuest}
            className="px-8 py-4 rounded-2xl bg-[#1b2d18] hover:bg-[#122110] dark:bg-[#8bc34a] dark:hover:bg-[#7cb73f] text-[#f7f5ed] dark:text-[#0b1409] font-extrabold text-sm shadow-md hover:shadow-xl transition-all inline-flex items-center gap-2 group tracking-wider btn-magnetic"
          >
            <span>START A QUEST</span>
            <ArrowRight className="w-4 h-4 text-[#8bc34a] dark:text-[#0b1409] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
