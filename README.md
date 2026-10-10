# 🌿 WildQuest
> **AI missions that get people outside — then get out of the way.**  
> *Built for Hacktoberfest 2026 Open-Source AI Challenge — Week 1: "Touch Grass"*

---

## 🧭 The Central Thesis

Most AI products are designed to compete for more of your attention: endless chat dialogues, infinite scroll feeds, and addictive notification loops.

**WildQuest uses AI to give your attention back.**

The core experience makes the **screen the shortest part of your journey**:
1. Open the app (~20 seconds)
2. Receive a tailored, physical-world observation mission
3. Enter distraction-free Outdoor Mode and **lock your screen**
4. Walk outside, touch grass, and observe real living ecosystems
5. Return when your timer chime rings, log a quick note or photo, and receive a short reflection that tunes your next mission

The best interaction with WildQuest is **closing the tab and stepping into the wind.**

---

## 🚀 Evaluation Walkthrough (Truthful Data Verification)

To test the application as a brand-new user:
1. Open the app — the **Account** and **Dashboard** start at clean zero:
   - *Quests completed: 0*
   - *Minutes outside: 0*
   - *Discoveries: 0*
   - *Current streak: 0*
   - *Outdoor Passport: Empty*
   - *Activity History: "No quests completed yet."*
2. Click **"+ Start Quest"** or **"Start a Quest"**.
3. Select your time allocation (e.g. 20–30 mins), environment (*Park*, *Neighborhood*, *Trail*, *Garden*, *Anywhere*), and focus category.
4. Watch the cinematic generation sequence:
   - *"Looking at your time..."*
   - *"Thinking about your surroundings..."*
   - *"Creating something worth leaving the screen for..."*
5. Inspect the generated **Available Quest** card. Notice that it does **NOT** appear as completed in your Account or Passport.
6. Click **"Begin Quest & Go Outside"** to enter distraction-free **Outdoor Mode**:
   - Sunlight-friendly / high-contrast palette toggle
   - Giant countdown timer
   - Locked screen reminder: *"Your next step is outside the app."*
   - Nature-tuned harmonic acoustic chime
   - (For evaluation, click *"Fast-Forward for Demo (5s left)"* to test the timer chime without waiting 30 minutes)
7. Click **"I Have Returned · Record Field Notes"**:
   - Answer 2 quick questions
   - Speak or type a field note, or add a field photo
   - Click *"Generate AI Reflection"* to receive Gemma's concise reflection
   - Click *"Stamp Field Passport & Close"*
8. Verify that:
   - Quests completed increments to **1**
   - Minutes outside updates with the real elapsed time
   - Streak increments to **1**
   - Discoveries count increments based on your recorded field note and photos
   - The Field Passport unlocks the visited place
   - Refreshing the page preserves your genuine activity!

---

## 🧠 Local Open-Weight AI Architecture

WildQuest is architected around **open-weight local intelligence**, not closed proprietary APIs.

```
                      ┌───────────────────────────────────────┐
                      │              AIProvider               │
                      │               Interface               │
                      └───────────────────┬───────────────────┘
                                          │
             ┌────────────────────────────┼────────────────────────────┐
             │                            │                            │
             ▼                            ▼                            ▼
  ┌──────────────────────┐   ┌─────────────────────────┐   ┌──────────────────────┐
  │  LocalGemmaProvider  │   │ OfflineAdaptiveProvider │   │ GeminiDevProvider    │
  │                      │   │                         │   │                      │
  │ • Open-weight        │   │ • 100% on-device        │   │ • Optional server-   │
  │ • Google Gemma 2     │   │ • Algorithmic tree      │   │   side proxy         │
  │   (2B / 9B) via      │   │ • Zero network needed   │   │ • Development        │
  │   Ollama / vLLM      │   │ • Trail/canyon ready    │   │   comparisons        │
  │ • 100% local private │   │ • Graceful fallback     │   │                      │
  └──────────────────────┘   └─────────────────────────┘   └──────────────────────┘
```

### 1. Which Model is Used?
WildQuest targets **Google Gemma 2 (2B parameter instruction-tuned: `gemma2:2b`)** as its primary engine, with support for `gemma2:9b`.
- **Lightweight footprint:** Runs smoothly on consumer laptops (under 2GB VRAM).
- **Instruction following:** Exceptional compliance with structured JSON schemas.
- **Open weights:** Freely downloadable, inspectable, and self-hostable.

### 2. How Inference is Performed
- **Primary Path (Local Inference):** Queries local Ollama at `http://127.0.0.1:11434` (or via the built-in server proxy `/api/ollama/generate` to avoid browser CORS).
- **Graceful On-Device Fallback:** If local Ollama is paused or unreachable, WildQuest automatically falls back to the **Offline Adaptive Engine** (`OfflineHeuristicProvider`), an algorithmic tree that incorporates your past reflections, streak, and environment into new missions without breaking the user flow.
- **Optional Development Provider:** A server-side proxy route `/api/gemini/generate` for comparison testing during development.

### 3. How to Run Gemma Locally in 2 Steps
Install [Ollama](https://ollama.com) and run:
```bash
# Pull and start Gemma 2 (2B)
ollama run gemma2:2b
```
WildQuest will automatically detect the local instance on port `11434`.

### 4. Swapping to Other Open Models
The provider architecture is completely model-agnostic. You can switch to any open-weight model (e.g. `llama3.2:3b`, `mistral:7b`, `phi3:mini`) simply by changing the model parameter in the AI Settings modal or in `.env`:
```env
LOCAL_OLLAMA_MODEL="gemma2:2b"
```

---

## 🛡️ Privacy-First Design: Zero Telemetry

Location is sensitive. WildQuest protects your physical whereabouts:

| Question | Answer |
| :--- | :--- |
| **What stays on your device?** | **Everything.** Quests, observation notes, photos, voice memos, minutes outside, and streaks are stored strictly in your browser (IndexedDB / localStorage). |
| **What leaves your device?** | **Nothing** when running Local Gemma or the Offline Adaptive Engine. No telemetry, no analytics cookies, no accounts. |
| **Do you track GPS coordinates?** | **No.** WildQuest uses coarse environmental categories (*Park*, *Neighborhood*, *Garden*, *Trail*, *Anywhere*). We never query high-precision GPS or upload coordinates. |

---

## 🎯 The 10 Quest Categories

1. **Nature Detective** — Clues, chewing marks, seed dispersal, and animal signs
2. **Movement & Wandering** — Navigation by natural horizon without screen maps
3. **Sensory Exploration** — 30-second eyes-closed acoustic mapping and micro-scents
4. **Biodiversity Hunt** — Serrated vs smooth leaf margins, lichens, and fungal colonies
5. **Field Photography** — Maximum 3 intentional frames after 10 minutes of silent looking
6. **Mindful Observation** — Solitary sit-spot canopy witness
7. **Neighborhood Discovery** — Urban flora resilience, weeds flowering in stone cracks
8. **Companion Quest** — Shared alternating observation with a friend, child, or dog
9. **Garden & Soil** — Topsoil moisture, decomposers, and root systems
10. **Seasonal Transition** — Micro-climate thermal pockets and autumn/spring shifts

---

## 📱 PWA & Offline Trail Readiness

- **Installable Progressive Web App:** Meets web app manifest standards with high-contrast icon.
- **Offline Shell:** Service worker precaches critical assets so the app launches in national parks and canyons without cell service.
- **Audio Chimes:** Harmonic frequencies (432Hz & 528Hz) generated using the native browser Web Audio API — zero external sound files to download.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- (Optional) [Ollama](https://ollama.com) for local Gemma inference

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/your-username/wildquest.git
cd wildquest

# 2. Install dependencies
npm install

# 3. (Optional) Run Gemma 2 locally
ollama run gemma2:2b

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts
- `npm run dev`: Starts the full-stack server (Vite + Express API proxy) on port 3000
- `npm run build`: Compiles TypeScript and builds optimized production assets
- `npm start`: Runs the production server
- `npm run lint`: Verifies TypeScript types

---

## 🌟 Hacktoberfest 2026 Innovation Highlights

- **Anti-Addiction Architecture:** Measured by how fast the user leaves the screen, not session length.
- **Adaptive Memory:** Gemma takes past field notes and difficulty feedback to generate progressively nuanced ecological questions.
- **Tactile Aesthetic:** Designed as a modern field naturalist's leather-and-parchment pocket journal, completely free of generic AI gradients and chatbots.

*WildQuest: Turn off the screen. Step into the wind. Touch grass.*
