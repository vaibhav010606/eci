# 🗳️ Matdaata Mitra — AI Voter Assistant

> **"Matdaata Mitra"** (मतदाता मित्र) means *"Voter's Friend"* in Hindi.  
> A voice-first, multilingual PWA that helps every Indian citizen navigate the voting process — regardless of literacy level.

---

## 🎯 Challenge Vertical

**Chosen Vertical: Smart Governance / Civic Education**

This solution addresses the critical gap in voter awareness and participation in India, especially among rural, elderly, and low-literacy populations. By combining an AI-powered conversational assistant with a zero-reading, icon-driven interface, Matdaata Mitra empowers citizens to:

- Register to vote and update their voter details
- Search their name on the official electoral roll
- Find their polling booth location (via Google Maps embed)
- Download their digital Voter ID (e-EPIC)
- Practice using an Electronic Voting Machine (EVM)
- File complaints and grievances with ECI

---

## 💡 Approach & Logic

### Design Philosophy: Zero-Reading Interface
The app is designed so a user can accomplish any task **without reading a single word**:
1. Every action is triggered by a **large, colourful icon tile**
2. **Audio narration** (via Sarvam AI TTS) speaks instructions aloud in the user's native language
3. **Voice input** (Web Speech API) lets users speak their queries to the AI assistant
4. The AI assistant (powered by **Gemini**) interprets natural language and routes users to the right government portal

### AI Decision Logic
The `AgentChatBox` component processes user queries through the following pipeline:

```
User speaks/types → Speech API transcribes → Gemini interprets intent
  → Intent maps to ECI action (form, link, or information)
  → Response spoken aloud in user's language via Sarvam TTS
```

**Intent Categories the AI resolves:**
- Voter registration → Redirects to `voters.eci.gov.in/form6`
- Name search → Opens Electoral Search portal
- Booth location → Shows Google Map + ECI link
- Complaint filing → Routes to NGSP grievance portal
- e-EPIC download → Opens Digilocker/ECI e-EPIC page

### Multilingual Architecture
A centralized `translations.js` dictionary drives all UI text. It supports **22 official Indian languages** with graceful English fallback. Language-specific fonts (Noto Sans series) are dynamically applied so every script renders correctly.

---

## 🏗️ How It Works

### Application Flow

```
┌─────────────────────────────────────────────────────────┐
│  1. Language Select  →  User picks their language       │
│  2. Home Screen      →  7 icon tiles + AI chat sidebar  │
│  3. User taps tile   →  Audio narration plays           │
│  4. Opens ECI portal →  Official government portal      │
│                                                         │
│  OR                                                     │
│                                                         │
│  3. User speaks/types to AI assistant                   │
│  4. Gemini processes intent                             │
│  5. Response spoken + action triggered                  │
└─────────────────────────────────────────────────────────┘
```

### Key Screens

| Screen | Purpose |
|--------|---------|
| **Language Select** | Picks from 22 Indian languages; stores in localStorage |
| **Home** | Dashboard with 7 action tiles + AI chatbox (desktop) |
| **Electoral Roll Search** | Links to official ECI voter search with audio guidance |
| **Voter Registration (RegisterAI)** | AI-guided registration with real ECI form links |
| **Voter ID** | e-EPIC download, Digilocker link, track application |
| **Voting Day** | Info on what to carry + Google Maps polling booth embed |
| **EVM Simulator** | Practice voting on a simulated Electronic Voting Machine |
| **Election Results** | Links to live ECI results portal |
| **Help Center** | Helpline numbers, grievance portals, FAQs |
| **Settings** | Accessibility: high contrast, font size, speech speed |

---

## ⚙️ Google Services Integration

| Service | Integration |
|---------|------------|
| **Firebase Analytics** | Page-view telemetry on every route change via `logEvent` |
| **Google Maps Embed API** | Interactive polling booth map on Voting Day screen |
| **Google Fonts** | Noto Sans scripts for all 22 Indian language scripts |
| **Gemini AI API** | Natural language intent processing in the AI assistant |

---

## 🔐 Security

- **API keys** stored in `.env` (`VITE_GEMINI_API_KEY`, `VITE_SARVAM_API_KEY`, `VITE_FIREBASE_API_KEY`) — never hardcoded
- **No server-side user data** — all preferences stored in browser `localStorage` only
- **All ECI links** are HTTPS and point exclusively to official government domains (`*.eci.gov.in`, `electoralsearch.eci.gov.in`)
- **Content Security** — no user input is executed; all AI output is displayed as text only

---

## ♿ Accessibility

- **52px+ touch targets** on all interactive elements (WCAG 2.1 AA)
- **High Contrast Mode** togglable from Settings
- **Adjustable font sizes** (Small / Medium / Large / Extra Large)
- **Screen reader** support via ARIA labels on all buttons
- **Audio narration** for every action and screen (speaks instructions aloud)
- **Speech speed control** (Slow / Normal / Fast) for users with hearing difficulties
- **Keyboard navigable** — all interactive elements are focusable

---

## 🧪 Testing

Tests are written with **Vitest** + **@testing-library/react** and cover:

| Test File | Coverage |
|-----------|---------|
| `Home.test.jsx` | Renders all 7 tiles, brand name, and AI chat box |
| `AgentChatBox.test.jsx` | Speech API fallback error handling |
| `AudioEngine.test.js` | Language code mapping for all 22 languages |
| `translations.test.js` | Key resolution, fallback, and variable interpolation |

```bash
npm run test           # Run tests in watch mode
npm run test:coverage  # Run with coverage report
```

---

## 🌐 Language Support (22 Official Indian Languages)

| Code | Language | Script | TTS Support |
|------|----------|--------|-------------|
| `en` | English | Latin | ✅ en-IN |
| `hi` | Hindi | Devanagari | ✅ hi-IN |
| `bn` | Bengali | Bengali | ✅ bn-IN |
| `ta` | Tamil | Tamil | ✅ ta-IN |
| `te` | Telugu | Telugu | ✅ te-IN |
| `ml` | Malayalam | Malayalam | ✅ ml-IN |
| `kn` | Kannada | Kannada | ✅ kn-IN |
| `gu` | Gujarati | Gujarati | ✅ gu-IN |
| `mr` | Marathi | Devanagari | ✅ mr-IN |
| `pa` | Punjabi | Gurmukhi | ✅ pa-IN |
| `or` | Odia | Odia | ✅ or-IN |
| `ur` | Urdu | Nastaliq | ✅ ur-IN |
| + 10 more | Assamese, Kashmiri, Sindhi, Manipuri... | Various | Browser fallback |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
git clone https://github.com/<your-username>/eciagent.git
cd eciagent
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SARVAM_API_KEY=your_sarvam_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### Running Locally

```bash
npm run dev
```

App runs at **http://localhost:5173**

### Running Tests

```bash
npm run test:coverage
```

### Production Build

```bash
npm run build
```

---

## 🏗️ Project Structure

```
eciagent/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── AgentChatBox.jsx  # AI conversational assistant (Gemini)
│   │   └── AgentChatBox.test.jsx
│   ├── pages/
│   │   ├── Home.jsx          # Dashboard with tile grid
│   │   ├── Home.test.jsx
│   │   ├── LanguageSelect.jsx
│   │   ├── ElectoralRollSearch.jsx
│   │   ├── RegisterAI.jsx    # AI-guided voter registration
│   │   ├── VoterID.jsx       # e-EPIC download
│   │   ├── VotingDay.jsx     # Booth info + Google Maps
│   │   ├── EVMSimulator.jsx  # EVM practice
│   │   ├── ElectionResults.jsx
│   │   ├── HelpCenter.jsx
│   │   ├── VoiceAssistant.jsx
│   │   └── Settings.jsx
│   ├── utils/
│   │   ├── translations.js   # 22-language dictionary (~600 keys)
│   │   ├── AudioEngine.js    # Sarvam AI TTS + browser fallback
│   │   ├── constants.js      # Language list + font mappings
│   │   ├── eciLinks.js       # Official ECI portal URLs
│   │   ├── firebase.js       # Firebase Analytics init
│   │   ├── AudioEngine.test.js
│   │   └── translations.test.js
│   ├── setupTests.js         # Vitest setup (JSDOM mocks)
│   ├── App.jsx               # Router, global state, Firebase
│   ├── main.jsx              # Entry point + PWA registration
│   └── index.css             # Design system + animations
├── .env                      # API keys (not committed)
├── .gitignore
├── package.json
├── vite.config.js            # Vite + Vitest + PWA config
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------| 
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS + Custom CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| AI | Google Gemini (`gemini-3-flash-preview`) |
| TTS | Sarvam AI Bulbul v3 + Web Speech API fallback |
| Analytics | Firebase Analytics |
| Maps | Google Maps Embed API |
| Fonts | Google Fonts (Noto Sans multi-script) |
| PWA | vite-plugin-pwa + Workbox |
| Testing | Vitest + Testing Library |

---

## 📝 Assumptions Made

1. **Connectivity** — Users have intermittent internet access. The app uses a PWA service worker for offline caching of core assets. AI features (Gemini, Sarvam TTS) gracefully degrade when offline with browser-native fallbacks.

2. **Device** — Primary target device is a budget Android smartphone (Chrome). The UI is designed for 360px–420px viewport widths with 52px minimum touch targets.

3. **Literacy** — Target users may have low literacy. The entire app can be navigated by sound and icons alone. Reading is never required.

4. **ECI Portal Integration** — The app does not replicate ECI functionality; it acts as a guided bridge to official ECI portals. All sensitive actions (registration, ID download) happen on ECI's secure servers.

5. **Language Completeness** — While all 22 languages have foundational translation keys, deep-page strings for some languages (e.g., Manipuri, Sindhi) may fall back to English. Hindi and English have 100% coverage.

---

## 📄 Disclaimer

> This is an **educational application** built for the hackathon challenge. For official voter registration and services, always visit [voters.eci.gov.in](https://voters.eci.gov.in). This app is **not affiliated** with the Election Commission of India.

---

*Built with ❤️ for accessible, inclusive democracy in India.*
