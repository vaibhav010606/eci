# 🗳️ Voting Assistant — Universal Voting Aid PWA

A voice-first, multilingual Progressive Web App (PWA) designed to help Indian citizens navigate the voting process. Built with React + Vite + Tailwind CSS, powered by **Sarvam AI** for native-language speech synthesis.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🎙️ **Voice-First UI** | Every screen speaks to you in your chosen language |
| 🌐 **6 Languages** | English, Hindi, Kannada, Tamil, Telugu, Malayalam |
| 🗳️ **Voter Roll Search** | Check if your name is on the electoral roll |
| 📝 **Voter Registration** | Guided Form 6 / Form 8 registration & update flow |
| 🖥️ **EVM Simulator** | Practice using an Electronic Voting Machine |
| 📊 **Election Results** | Live election results via ECI portals |
| ❓ **Help & Complaints** | ECI helpline links and complaint filing |
| ⚙️ **Accessibility** | High contrast mode, adjustable font sizes, speech speed control |
| 📱 **PWA** | Installable on mobile, works offline via service worker |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
git clone <repo-url>
cd "Election Process Education"
npm install
```

### Running Locally

```bash
npm run dev
```

App runs at **http://localhost:5173**

### Production Build

```bash
npm run build
```

Output goes to `dist/`. Includes PWA service worker and web manifest.

### Public Tunnel (for sharing / mobile testing)

```bash
npx cloudflared tunnel --url http://localhost:5173
```

Copy the generated `trycloudflare.com` URL and open on any device.

---

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── Home.jsx              # Main dashboard with tile grid
│   ├── LanguageSelect.jsx    # Language selection splash screen
│   ├── ElectoralRollSearch.jsx  # Voter name search
│   ├── FormWizard.jsx        # Voter registration/update forms
│   ├── EVMSimulator.jsx      # EVM practice booth
│   ├── ElectionResults.jsx   # Live results viewer
│   ├── HelpCenter.jsx        # Help & complaints
│   ├── VoiceAssistant.jsx    # AI voice assistant interface
│   ├── Settings.jsx          # Accessibility settings
│   └── Intro.jsx             # Intro/splash screen
│
├── utils/
│   ├── translations.js       # Centralized translation engine (6 languages)
│   ├── AudioEngine.js        # Sarvam AI TTS engine with browser fallback
│   ├── constants.js          # Language list and font mappings
│   └── eciLinks.js           # Official ECI portal URLs
│
├── App.jsx                   # Root component, routing, global state
├── main.jsx                  # Entry point, PWA service worker registration
└── index.css                 # Global styles, Tailwind base
```

---

## 🌐 Language Support

| Code | Language | Script | Sarvam TTS |
|------|----------|--------|------------|
| `en` | English | Latin | ✅ en-IN |
| `hi` | Hindi | Devanagari | ✅ hi-IN |
| `kn` | Kannada | Kannada | ✅ kn-IN |
| `ta` | Tamil | Tamil | ✅ ta-IN |
| `te` | Telugu | Telugu | ✅ te-IN |
| `ml` | Malayalam | Malayalam | ✅ ml-IN |

### Adding a new language
1. Add entry to `OFFICIAL_LANGUAGES` in `src/utils/constants.js`
2. Add font mapping to `LANG_FONTS` in `src/utils/constants.js`
3. Add language code mapping in `AudioEngine.getLanguageCode()`
4. Add translation block in `src/utils/translations.js`

---

## 🎙️ Audio Engine

**File:** `src/utils/AudioEngine.js`

Uses **Sarvam AI Bulbul v3** (`bulbul:v3`) with speaker `shubh` for high-quality, natural-sounding Indian language TTS.

### How it works
1. On first user click → `AudioEngine.unlock()` is called to bypass browser autoplay restrictions
2. `AudioEngine.speak(text, langCode)` calls the Sarvam API
3. Response is `{ audios: ["<base64_wav>"] }` — decoded to a WAV blob and played
4. Falls back to **browser Web Speech API** if Sarvam fails

### API Configuration

```js
static API_KEY = "sk_b9tbodgh_fzCEsmhYF4iKvLFHfY8kCDsJ";
static API_URL = "https://api.sarvam.ai/text-to-speech";
```

> ⚠️ **Security Warning:** The API key is currently hardcoded for development. Before production deployment, move it to a **secure backend proxy** (e.g., a Cloud Run or Express server) so it is never exposed client-side.

### Audio controls
- **Mute toggle** — header button
- **Replay** — floating 🔊 button (bottom-right)
- **Speed** — Slow / Normal / Fast (in Settings)
- **AbortController** — prevents audio overlap when navigating quickly

---

## 🔑 Translation Engine

**File:** `src/utils/translations.js`

```js
import { t } from './utils/translations';

// Usage:
t('welcome', 'hi')  // → "स्वागत है। शुरू करने के लिए कोई भी टाइल दबाएं।"
t('welcome', 'ta')  // → "வரவேற்கிறோம்..."
t('welcome', 'xx')  // → falls back to English
```

### Translation keys used across the app

| Key | Purpose |
|-----|---------|
| `title` | App name in header |
| `welcome` | Home screen greeting |
| `check_name` | Voter roll search tile |
| `voter_drive_active` | Banner text |
| `va_welcome` | Voice assistant greeting |
| `va_listening` | Mic active state |
| `high_contrast` | Settings label |
| `disclaimer` | ECI disclaimer footer |
| *(and ~40 more)* | See `translations.js` for full list |

---

## ⚙️ Accessibility & Settings

All settings are persisted in `localStorage`:

| Key | Values | Default |
|-----|--------|---------|
| `voting_agent_lang` | `en`, `hi`, `kn`, `ta`, `te`, `ml` | *(none — language select shown)* |
| `voting_agent_muted` | `true` / `false` | `false` |
| `voting_agent_hc` | `true` / `false` | `false` |
| `voting_agent_fs` | `small`, `medium`, `large`, `extra-large` | `medium` |
| `voting_agent_speed` | `slow`, `normal`, `fast` | `normal` |

---

## 🔗 ECI Integration

All government links point to official ECI portals:

| Service | URL |
|---------|-----|
| Voter Search | https://electoralsearch.eci.gov.in |
| Voter Registration | https://voters.eci.gov.in |
| National Voter Helpline | 1950 |
| Voter ID Download | https://voterportal.eci.gov.in |
| Election Results | https://results.eci.gov.in |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| TTS | Sarvam AI (Bulbul v3) + Web Speech API fallback |
| PWA | vite-plugin-pwa + Workbox |
| Fonts | Google Fonts — Noto Sans (multi-script) + Public Sans |
| Tunnel | Cloudflare Tunnel (dev sharing) |

---

## 📦 Key Dependencies

```json
{
  "react": "^18",
  "react-router-dom": "^6",
  "framer-motion": "^11",
  "lucide-react": "^0.400",
  "recharts": "^2",
  "vite-plugin-pwa": "^0.20",
  "tailwindcss": "^3"
}
```

---

## 🔐 Security Notes

1. **Sarvam API Key** — currently client-side. Move to a backend before production:
   ```
   Client → Your Backend → Sarvam AI
   ```
2. **No user data stored server-side** — all settings stored in browser `localStorage` only
3. **All ECI links are HTTPS** and point to official government domains

---

## 📱 PWA Installation

On Chrome/Android:
1. Open the public URL
2. Tap the **"Add to Home Screen"** prompt
3. App installs and works offline

On iOS Safari:
1. Tap **Share** → **Add to Home Screen**

---

## 🐛 Known Issues & Fixes Applied

| Issue | Fix |
|-------|-----|
| Audio double-play bug | `AbortController` cancels pending requests |
| Browser autoplay blocked | `AudioEngine.unlock()` on first user click |
| Wrong Sarvam endpoint (`/stream`) | Fixed to `/text-to-speech` with base64 decode |
| `translations.js` was empty | Rebuilt with all 6 languages and ~50 keys |
| Missing keys (`va_welcome`, etc.) | Added all Home + VoiceAssistant keys |
| Syntax error (missing commas) | Fixed with `sed` on `va_not_understood` lines |

---

## 🗺️ Roadmap

- [ ] Backend proxy for Sarvam API key security
- [ ] Offline TTS fallback cache
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Add more Indian languages (Bengali, Marathi, Gujarati, Punjabi)
- [ ] Real-time ECI data API integration
- [ ] Push notifications for election dates

---

## 📄 Disclaimer

> This is an **educational application**. For official voter registration and services, always visit [voters.eci.gov.in](https://voters.eci.gov.in). This app is not affiliated with the Election Commission of India.

---

*Built with ❤️ for accessible, inclusive democracy.*
